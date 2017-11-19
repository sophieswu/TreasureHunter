const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  productId: String,
  productName: String,
  productPrice: Number,
  productNum: Number,
  checked: String,
  productImg: String,
  auction: {
    isAuction: { type: Boolean, default: false },
    expire: { type: Number, default: Date.now() },
    winningBidBy: { type: String, default: '' },
  },
  productDescription: { type: String, default: '' },
  soldBy: String,
});

module.exports = mongoose.model('Item', productSchema);
