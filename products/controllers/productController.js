const db = require("../models");

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => {
    console.error("Error synchronizing database:", err);
  });

module.exports = db;
// image Upload
const multer = require("multer");
const path = require("path");

// create main Model
const Product = db.products;
const Review = db.reviews;
const Category = db.category;

// 1. create product

const addProduct = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Category ID:", id);
    // const category = await Category.findByPk(id);
    // if (!category) {
    //     return res.status(404).json({
    //         status: false,
    //         msg: "Category not found"
    //     });
    // }

    let info = {
      // image: req.file.path,
      category_id: parseInt(id),
      image: req.body.image,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      published: req.body.published ? req.body.published : false,
    };
    console.log("Product Info:", info);
    const product = await Product.create(info);
    console.log("Product created:", product); //ank
    res.status(200).json({
      status: true,
      data: product,
    });
    console.log(product);
  } catch (e) {
    console.error("Error adding product:", e);
    res.status(500).json({
      status: false,
      msg: "This product cant be added right now, Please try again later",
      // msg: 'Internal Server Error, Please try again later'
    });
  }
};

// 2. get all products

const getAllProducts = async (req, res) => {
  try {
    let products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name", "image"],
        },
        {
          model: Review,
          as: "review",
          attributes: [
            "id",
            "rating",
            "description"
            // [Review.sequelize.fn("SLEEP", 0.2), "test"], // Disable Slow query
          ],
        },
      ],
    });
    console.log("All products fetched successfully:", products); //ank
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (e) {
    console.error("Error fetching all products:", e);
    res.status(500).json({
      status: false,
      msg: "Product cant be fetched right due to some internal server error",
      // msg: 'Internal Server Error, Please try again later'
    });
  }
};

// 3. get single product

const getOneProduct = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(`Product ID from request params: ${id}`); //ank
    let product = await Product.findOne({ where: { id: id } });
    console.log("Query executed to find the product"); //ank
    if (!product) {
      console.error("Product not found"); //ank
      console.log("Product not found"); //ank
      res.status(404).json({
        status: false,
        msg: "Product not found",
      });
    } else {
      console.log("Product found:", product);
      res.status(200).json({
        status: true,
        data: product,
      });
    }
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error, Please try again later",
    });
  }
};

// 4. update Product

const updateProduct = async (req, res) => {
  try {
    //console.log('Request received to update product');//ank
    let id = req.params.id;
    const [affectedRows] = await Product.update(req.body, {
      where: { id: id },
    });
    console.log("Query executed to update the product"); //ank
    if (affectedRows > 0) {
      console.log(`Product with ID ${id} updated successfully`);
      res.status(200).json({
        status: true,
        msg: "Product updated successfully",
      });
    } else {
      console.error(`Product with ID ${id} not found`); //ank
      console.log(`Product with ID ${id} not found`); //ank
      res.status(404).json({
        status: false,
        msg: "Product not found",
      });
    }
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error, Please try again later",
    });
  }
};

// 5. delete product by id

const deleteProduct = async (req, res) => {
  try {
    console.log("Request received to delete product"); //ank
    let id = req.params.id;
    console.log(`Product ID from request params: ${id}`); //ank
    const affectedRows = await Product.destroy({ where: { id: id } });
    console.log("Query executed to delete the product"); //ank
    if (affectedRows > 0) {
      console.log(`Product with ID ${id} deleted successfully`);
      res.status(200).json({
        status: true,
        msg: "Product deleted successfully",
      });
    } else {
      console.error(`Product with ID ${id} not found`); //ank
      console.log(`Product with ID ${id} not found`); //ank
      res.status(404).json({
        status: false,
        msg: "Product not found",
      });
    }
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

// 6. get published product

const getPublishedProduct = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { published: true },
    });
    console.log("Published products fetched successfully:", products);
    res.status(200).json({
      status: true,
      data: products,
    });
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

// 7. connect one to many relation Product and Reviews

const getProductReviews = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Product ID from request params: ${id}`); //ank
    const data = await Product.findOne({
      include: [
        {
          model: Review,
          as: "review",
        },
      ],
      where: { id: id },
    });
    console.log("Query executed to find the product and its reviews"); //ank
    if (!data) {
      console.error(`Product with ID ${id} not found`); //ank
      console.log(`Product with ID ${id} not found`);
      res.status(404).json({
        status: false,
        msg: "Product not found",
      });
    } else {
      console.log(`Product with ID ${id} found with reviews`, data); //ank
      res.status(200).json({
        status: true,
        data: data,
      });
    }
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

// 7/a  connect one to many relation category and product
const getCategoryProduct = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Category ID from request params: ${id}`); //ank
    const data = await Category.findOne({
      include: [
        {
          model: Product,
          as: "products",
        },
      ],
      where: { id: id },
    });
    console.log("Query executed to find the category and its products"); //ank
    if (!data) {
      console.error(`Category with ID ${id} not found`); //ank
      console.log(`Category with ID ${id} not found`); //ank
      res.status(404).json({
        status: false,
        msg: "Category not found",
      });
    } else {
      console.log(
        "Category and associated products fetched successfully:",
        data
      );
      res.status(200).json({
        status: true,
        data: data,
      });
    }
  } catch (e) {
    console.error("Error occurred:", e);
    res.status(500).json({
      status: false,
      msg: "Internal Server Error",
    });
  }
};

// 8. Upload Image Controller

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("image");

const getProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log(`Product ID from request params: ${productId}`); //ank

    const product = await Product.findByPk(productId);
    console.log("Query executed to find the product by ID"); //ank

    if (product) {
      console.log("Product fetched successfully:", product); //ank
      res.status(200).json(product);
    } else {
      console.error(`Product with ID ${productId} not found`); //ank
      console.log(`Product with ID ${productId} not found`);
      res.status(404).json({
        message: "Product not found",
      });
    }
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  getPublishedProduct,
  getProductReviews,
  upload,
  getCategoryProduct,
  getProductById,
};
