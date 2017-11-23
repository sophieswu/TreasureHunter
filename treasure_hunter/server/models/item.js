const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productId: String,
  productName: String,
  productPrice: Number,
  productNum: Number,
  soldBy: String,
  checked: String,
  productImg: String,
  auction: {
    isAuction: { type: Boolean, default: false },
    expire: { type: Date, default: Date.now },
    winningBidBy: { type: String, default: '' },
  },
  productDescription: { type: String, default: '' },
});

module.exports = mongoose.model('Item', productSchema);
