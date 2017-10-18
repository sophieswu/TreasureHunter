var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var productSchema = new Schema({
  // "productId":String,
  // "productName":String,
  // "productPrice":Number,
  // "productImg":String
    "productId":String,
    "productName":String,
    "productPrice":Number,
    "productNum":Number,
    "checked":String,
    "productImg":String
});

module.exports = mongoose.model("Item", productSchema);