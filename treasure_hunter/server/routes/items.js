/* eslint-disable */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Items = require('../models/item');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

AWS.config.loadFromPath( '../config/aws.json' );
const s3 = new AWS.S3();


mongoose.Promise = global.Promise;
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
        } else {
            console.log(("userDoc"+userDoc));
            if(userDoc) {
                console.log("userDoc");
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

router.post('/bid', function (req, res, next) {
    console.log(req.body);
    let fullname = req.body.fullname;
    var Id = req.body.productId;
    var newBid = req.body.bidPrice;
    var Item = require('../models/item');

    Item.findOne({ productId: Id }, function (err, doc) {
      if (err) {
        console.log(12323);
      }
      doc.productPrice = newBid;
      doc.auction.winningBidBy = fullname;
      doc.save(function (err3, doc3) {
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
      });
    })

});


const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'treasure-hunter-csc210',
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      },


      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null,`${Date.now().toString()}-${file.originalname}`)
      }
    })
  })

router.post('/addSell', upload.single('file'), function(req,res,next){
    const name = req.body.name;
    const price = parseFloat(req.body.price);
    const soldBy = req.body.seller;
    const productDescription = req.body.productDescription;
    const location = req.file.location;
    const isAuction = (req.body.isAuction=='true')? true : false;
    const expire = parseInt(req.body.expire);
    const Item = require('../models/item');
    var findNextProductId = Item.find().sort({productId : -1}).limit(1);
    
    findNextProductId.exec(function(err, maxResult){
        if (err) {return err;}
        const productId = maxResult[0].productId + 1;
        var item = new Item({
            productId: productId,
            productPrice: price,
            productName: name,
            soldBy: soldBy,
            productDescription:productDescription,
            productId:productId,
            productImg: location,
            productNum: 1,
            checked: '',
            auction: {
                isAuction: isAuction,
                expire: expire,
            }
        });
        
        item.save(function(err1,doc) {
            if(err1){
                console.log(err1);
                return;
            }
            res.json({
                status: 200,
                token: ''
            })
        });
    
    })
        


});

router.post('/deleteSell',function(req,res,next){
    console.log(req.body);
    let productName = req.body.productName;

    var Item = require('../models/item');
    console.log(productName);
    Item.findOne({productName: productName}, function(err, item) {
        if (!item) {
            res.json({
                status: "1",
                msg: "item not exist"
            })
        }else {
            console.log("continue delete", productName);
            Item.remove({productName: productName}, function (err, item) {
                if (err) {
                    res.json({
                        status: "0",
                        msg: "delete fail"
                    })
                    return;
                } else {
                    res.json({
                        status: "0",
                        msg: "delete suc"
                    })
                }

            });
        }
    });
});


    // Item.update({ productId: Id }, { productPrice: newBid}, function (err, raw) {
    //   console.log(raw);
    //   if (err) {
    //     res.json({
    //       status: "1",
    //       msg: err.message
    //     })
    //   } else {
    //     res.json({
    //       status: '0',
    //       result: 'suc'
    //     })
    //   }
    // });


module.exports = router;