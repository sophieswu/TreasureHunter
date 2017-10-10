var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Items = require('../models/item');

mongoose.connect("mongodb://dev_user:rochester@ds113795.mlab.com:13795/treasure_hunter",
{
  useMongoClient: true,
  /* other options */
});

mongoose.connection.on("connected", function(){
  console.log("MongDB connected success!");
});

mongoose.connection.on("error", function(){
  console.log("MongDB error!");
});

mongoose.connection.on("discounted", function(){
  console.log("MongDB discounted!");
});

router.get("/", function(req, res, next){
  
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let sort = req.query.sort;
  let skip = (page - 1) * pageSize;

  let params = {};
  let itemsModel = Items.find(params).skip(skip).limit(pageSize);
  itemsModel.sort({"productPrice":sort});

  itemsModel.exec({}, function(error, doc){
    if (error){
      res.json({
        status: 1,
        msg: error.message,
      })
    } else {
      res.json({
        status: 0,
        msg: "",
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  });
})

module.exports = router;