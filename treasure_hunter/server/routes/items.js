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

router.get("/list", function(req, res, next){
  console.log(1);
  let page = parseInt(req.query.page);
  let pageSize = parseInt(req.query.pageSize);
  let sort = req.query.sort;
  let skip = (page - 1) * pageSize;

  var priceLevel = req.query.priceLevel;
  var priceGt = '',priceLte = '';

  let params = {};

  if(priceLevel!='all'){
    if(priceLevel != 'all'){
        console.log(priceLevel)
    }
    switch (priceLevel){
        case '0':priceGt = 0;priceLte = 200;break;
        case '1':priceGt = 200;priceLte = 400;break;
        case '2':priceGt = 400;priceLte = 1000;break;
        case '3':priceGt = 1000;priceLte = 2000;break;
        case '4':priceGt = 2000;priceLte = 5000;break;
    }
    params = {
        productPrice:{
            $gt:priceGt,
            $lte:priceLte
        }
    }
  }

  let itemsModel = Items.find(params).skip(skip).limit(pageSize);
  itemsModel.sort({"productPrice":sort});

  itemsModel.exec({}, function(error, doc){
    if (error){
      res.json({
        status: 1,
        msg: error.message,
      });
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
router.post('/alterOne',function(req,res,next){
    console.log(req.body);
    let fullname = req.body.fullname;
    let productId = req.body.productId;
    let flag = req.body.flag;
    console.log(fullname+'hoh'+productId+' '+flag);
    var User = require('../models/user');

    User.findOne({fullname:fullname},function(err,userDoc){
        if(err){
            console.log("f");
            res.json({
                status:"1",
                msg:err.message
            })
        }else{
            console.log(("userDoc"+userDoc));
            if(userDoc) {
                let goodsItem = '';
                userDoc.cartList.forEach(function (item) {
                    if (item.productId == productId) {
                        goodsItem = item;
                        if(flag==1) {
                            item.productNum++;
                        }else if(flag==0){
                            if(item.productNum==1){
                                userDoc.cartList.remove(item);
                            }else {
                                item.productNum--;
                            }
                        }else if(flag=-1){
                            userDoc.cartList.remove(item);
                        }
                    }
                });
                //if there are same product in cartlist
                if (goodsItem) {
                    userDoc.save(function (err3, doc3) {
                        if (err3) {
                            res.json({
                                status: "1",
                                msg: err3.message
                            })
                        } else {
                            res.json({
                                status: '0',
                                result: 'suc'
                            })
                        }
                    })
                }
            }
        }
    })
}),
router.post('/addCart',function(req,res,next){
    console.log(req.body);
    let fullname = req.body.fullname;
    var productId = req.body.productId;
    console.log(fullname+'hoh'+productId);
    var User = require('../models/user');

    User.findOne({fullname:fullname},function(err,userDoc){
        if(err){
            console.log("f");
            res.json({
                status:"1",
                msg:err.message
            })
        }else{

            console.log(("userDoc"+userDoc));

            if(userDoc) {

                let goodsItem = '';
                userDoc.cartList.forEach(function (item) {
                    if (item.productId == productId) {
                        goodsItem = item;
                        item.productNum++;
                    }
                });
                //if there are same product in cartlist
                if (goodsItem) {
                    userDoc.save(function (err3, doc3) {
                        if (err3) {
                            res.json({
                                status: "1",
                                msg: err3.message
                            })
                        } else {
                            res.json({
                                status: '0',
                                result: 'suc'
                            })
                        }
                    })
                } else {// if not. find that product
                    Items.findOne({productId: productId}, function (err1, doc) {
                        if (err1) {
                            res.json({
                                status: "1",
                                msg: err1.message
                            })
                        } else {
                            if (doc) {
                                doc.productNum = 1;
                                doc.checked = 1;
                                console.log('??doc '+doc);
                                userDoc.cartList.push(doc);
                                userDoc.save(function (err2, doc) {
                                    if (err2) {
                                        res.json({
                                            status: "1",
                                            msg: err2.message
                                        })
                                    } else {
                                        res.json({
                                            status: '0',
                                            result: 'suc'
                                        })
                                    }
                                })
                            }
                        }
                    })
                }
            }
        }
    })
});


module.exports = router;