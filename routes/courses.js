
const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Category = require("../models/category");
var moment = require("moment");

// GET: display all products
router.get("/", async (req, res) => {
  const perPage = 9;
  let page = parseInt(req.query.page) || 1;
  try {
    const products = await Product.find({})
      .sort("createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");

    const count = await Product.count();
    console.log(products);
    res.render("courses", {
      pageName: "Khóa học",
      products,
      current: page,
      breadcrumbs: null,
      home: "/courses/?",
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// GET: search box
router.get("/search", async (req, res) => {
  const perPage = 9;
  let page = parseInt(req.query.page) || 1;

  try {
    const products = await Product.find({
      title: { $regex: req.query.search, $options: "i" },
    })
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category")
      .exec();
    const count = await Product.count({
      title: { $regex: req.query.search, $options: "i" },
    });
    res.render("courses", {
      pageName: "Tìm kiếm",
      products,
      current: page,
      breadcrumbs: null,
      home: "/courses/search?search=" + req.query.search + "&",
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

//GET: get a certain category by its slug (this is used for the categories navbar)
router.get("/:slug", async (req, res) => {
  const perPage = 9;
  let page = parseInt(req.query.page) || 1;
  try {
    const foundCategory = await Category.findOne({ slug: req.params.slug });
    const allProducts = await Product.find({ category: foundCategory.id })
      .sort("-createdAt")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .populate("category");

    const count = await Product.count({ category: foundCategory.id });

    res.render("courses", {
      pageName: foundCategory.title,
      currentCategory: foundCategory,
      products: allProducts,
      current: page,
      breadcrumbs: req.breadcrumbs,
      home: "/courses/" + req.params.slug.toString() + "/?",
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
});

// GET: display a certain product by its id
router.get("/:slug/:productCode", async (req, res) => {
  try {
    const product = await Product.findOne({ productCode: req.params.productCode }).populate("category");
    const foundCategory = await Category.findOne({ slug: req.params.slug });
    const relatedProducts = await Product.find({ category: foundCategory.id })
      .sort("-createdAt")
      .limit(6)
      .populate("category");
    console.log(`${product} saved successfully`);
    res.render("course-detail", {
      pageName: product.title,
      product,
      relatedProducts,
      home: "/courses/" + req.params.slug.toString() + "/" + product.slug + "/?",
      moment: moment,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
});

module.exports = router;
