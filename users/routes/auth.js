const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { createTokens } = require("../tokensFunc/createToken");
const { signUpValidation, loginValidation } = require("../validation");
const { validateToken } = require("../authMiddleware");
const { authenticateToken, ipAccessMiddleware } = require("../authMiddleware");

const axios = require("axios");

//error route
//for 501 error
router.get("/errors/501", (req, res) => {
  res
    .status(501)
    .send("501 Not Implemented ,Missing Feature or Dependency on the Server");
});
//for 503 error
router.get("/errors/503", (req, res) => {
  res
    .status(503)
    .send("503 Service Unavailable or this route is under maintenance");
});
//for refeernce error
router.get("/error", (req, res) => {
  res.send(data);
});

//error
router.get("/error2", (req, res) => {
  res.send("data");
});

router.get("/error3", (req, res) => {
  const errorData = {
    message: "CUA: An internal error has occurred. Please try again later",
    errorCode: 500,
  };
  console.error(`Error ${errorData.errorCode}: ${errorData.message}`);
  res.status(errorData.errorCode).send(errorData);
});

router.post("/signup", ipAccessMiddleware, async (req, res) => {
  console.log(req.headers);
  try {
    const { error } = signUpValidation(req.body);
    if (error) {
      console.log("CUA: Validation error:", error.details[0].message); //ank
      return res.status(400).json({
        error: true,
        message: error.details[0].message,
        status: false,
      });
    }

    const emailExist = await User.findOne({ where: { email: req.body.email } });
    // console.error("This Email Id already exists",emailExist)
    if (emailExist) {
      console.error("This Email Id already exists", emailExist);
      return res.status(400).send({
        message: "This Email Id already exists",
        status: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      contactNo: req.body.contactNo || " ",
    });

    res.status(201).send({
      message: "Success!",
      status: true,
    });
    console.log("Success from signup", newUser.email);
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).send({
      message: err.message,
      status: false,
    });
  }
});

router.post("/login", ipAccessMiddleware, async (req, res) => {
  try {
    const { error } = loginValidation(req.body);
    if (error) {
      const log = {
        type: "Validation Error",
        statusCode: error.status || 400,
        message: error.details[0].message,
        timestamp: new Date().toISOString(),
      };
      console.error(log);
      return res.status(log.statusCode).send({
        message: log.message,
        status: false,
      });
    }

    // Validate if user exists
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      const log = {
        type: "User Not Found",
        statusCode: 400,
        message: "Email ID does not exist",
        timestamp: new Date().toISOString(),
      };
      console.error(log);
      return res.status(log.statusCode).send({
        message: log.message,
        status: false,
      });
    }

    // Validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      const log = {
        type: "Authentication Error",
        statusCode: 401,
        message: "Invalid credentials",
        timestamp: new Date().toISOString(),
        userEmail: req.body.email,
      };
      console.error(log);
      return res.status(log.statusCode).send({
        message: log.message,
        status: false,
      });
    }

    // Generate tokens
    const { accessToken, refreshToken } = await createTokens(user);
    if (!accessToken) {
      const log = {
        type: "Token Generation Error",
        statusCode: 500,
        message: "Access token not provided or doesn't exist",
        timestamp: new Date().toISOString(),
        userId: user.id,
        userEmail: user.email,
      };
      console.error(log);
      return res.status(log.statusCode).json({
        message: log.message,
        status: false,
      });
    }

    console.log(
      `Success from login, login Successfully - User Email: ${user.email}, User ID: ${user.id}`
    );
    res.status(200).json({
      accessToken,
      refreshToken,
      message: "Logged in successfully",
      status: true,
    });
  } catch (err) {
    const log = {
      type: "Server Error",
      statusCode: err.status || 500,
      message: err.message,
      timestamp: new Date().toISOString(),
    };
    console.error(log);
    res.status(log.statusCode).send({
      message: log.message,
      status: false,
    });
  }
});

router.post("/validate-token", validateToken);

// userid is present or not in db
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByPk(userId);

    if (user) {
      console.log(`User with ID ${userId} found:`, user); //ank
      return res.status(200).json({
        user,
        status: true,
      });
    } else {
      console.error(`User with ID ${userId} not found`); //ank
      res.status(404).json({
        message: "User not found",
        status: false,
      });
    }
  } catch (error) {
    console.error("Error occurred:", error); //ank
    res.status(500).json({
      message: "Internal server error",
      status: false,
    });
  }
});

router.get("/user/details", authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);
    if (!user) {
      console.error(` User with ID ${userId} not found`); //ank
      return res.status(404).json({ message: "User not found", status: false });
    }
    const userDetails = {
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactNo: user.contactNo,
    };

    res.status(200).json({ userDetails, status: true });
    console.log(
      "Success from user/details, user details found!",
      userDetails.userId
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
});

router.put("/update-user/:userId", authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  const updatedData = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      console.error(`User with ID ${userId} not found`); //ank
      return res.status(404).json({ error: " User not found" });
    }
    await user.update(updatedData);
    res
      .status(200)
      .json({ message: "Updated your details successfully!", status: true });
    console.log("Success from update-user, details updated");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
});

module.exports = router;
