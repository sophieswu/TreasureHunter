var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();


var userModel = require('../models/user');
var authService = require('../services/authService');


router.post('/login', jsonParser, function(req, res) {
  authService.login(req.body.email, req.body.password, function(json) {
      if (json.status !== 200) {
          res.status(json.status).send({message: json.message});
      } else {
          res.send({token: json.token, user: json.user});
      }
  });
});

router.post('/reg', jsonParser, function(req, res) {
authService.reg(req.body.email, req.body.password, req.body.fullname,
    function(json) {
        if (json.status === 409) {
            res.status(409).send({message: json.message});
        } else {
            res.send({token: json.token});
        }
    });
});

router.get('/isLoggedIn', function(req, res) { 
  authService.isAuthenticated(req, res, (req, res) => {
    if(req.user){
      res.status(200).send(req.user.fullname);
    }
        
  });
});

module.exports = router;
