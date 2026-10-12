const db = require("../models");

const Category = db.category;
const Product = db.products;
const Review = db.reviews;

// 1. create category
const addCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    const category = await Category.create({
      name,
      image,
    });

    console.log("Created category:", category); //ank
    res.status(200).json({
      status: true,
      data: category,
    });
  } catch (e) {
    console.error("Error adding category:", e); //modified ank
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

// 2. get all categories
const getAllCategories = async (req, res) => {
  console.log(req.headers);
  try {
    let categories = await Category.findAll({
      // If we need to show the products that carrying category and
      // the product review also in allCategories then uncomment the lines below
      // include: [
      //     {
      //         model: Product,
      //         as: 'products',
      //         attributes: ['id', 'title', 'image'],
      //         // include: [
      //         //     {
      //         //         model: Review,
      //         //         as: 'review',
      //         //         attributes: ['id', 'rating', 'description'],
      //         //     },
      //         // ],
      //     },
      // ],
    });

    res.status(200).json({
      status: true,
      data: categories,
    });
  } catch (e) {
    console.error("Error getting all category:", e); //modified ank
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    let id = req.params.id;
    const [affectedRows] = await Category.update(req.body, {
      where: { id: id },
    });
    if (affectedRows > 0) {
      const updatedCategory = await Category.findByPk(id);
      console.log("Updated category data:", updatedCategory);
      res.status(200).json({
        status: true,
        msg: "Category updated successfully",
      });
    } else {
      console.error("Category not found with ID:", id); //ank log
      console.log("Category not found with ID:", id); //ank
      res.status(404).json({
        status: false,
        msg: "Category not found",
      });
    }
  } catch (e) {
    console.error("Error updating category:", e); //modified ank
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  updateCategory
};
