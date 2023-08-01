var express = require('express');
var router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");

/* GET home page. */
router.get("/", async (req, res) => {
  try {
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: 'products', localField: '_id',
          foreignField: 'category', as: 'products'
        },
      },
    ]);

    res.render("index", { pageName: "Trang chủ", categories });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

/* GET about us. */
router.get("/about-us", async (req, res) => {
  res.render("about", { pageName: "Thông tin" });
});

router.get("/contact", async (req, res) => {
  res.render("contact", { pageName: "Liên hệ" });
});



module.exports = router;   
