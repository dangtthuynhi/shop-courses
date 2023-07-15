var express = require('express');
var router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

/* GET home page. */
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({})
      .sort("-createdAt")
      .populate("category")
      .limit(3);

    const categories = await Category.find({});

    res.render("index", { pageName: "Trang chủ", products, categories});
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

module.exports = router;
