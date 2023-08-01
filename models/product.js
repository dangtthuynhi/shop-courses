const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productSchema = Schema({
  productCode: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    slug: "title",
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  imagePath: {
    type: String,
    required: true,
    get: convertImagePath,
  },
  description: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  available: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  linkForm: {
    type: String,
    required: true,
  },
});

function convertImagePath(imagePath) {
  // Array of allowed files
  const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'gif'];

  var result = imagePath;
  // Get the extension of the uploaded file
  const file_extension = imagePath.slice(
    ((imagePath.lastIndexOf('.') - 1) >>> 0) + 2
  );

  // Check if the uploaded file is allowed
  if (!array_of_allowed_files.includes(file_extension)) {
    result = imagePath.replace(/\/file\/d\/(.+)\/(.+)/, "/uc?export=view&id=$1")
  }
  return result;
}

module.exports = mongoose.model("Product", productSchema);
