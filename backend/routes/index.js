var express = require('express');
var router = express.Router();

const db = require('../mongoCx');

/* GET home page. */
router.get('/', async function(req, res, next) {
  //console.log(req.cookies);
  //console.log(req.cookies.authCookie)
  if(req.cookies.authCookie != undefined){
    let mongo = await db.getDB('foursome');
    let results = await mongo.collection('currentUsers').find({loginsecret: req.cookies.authCookie}).toArray();
    console.log( "results from mongo: " + results);
    if (!results.length)  {
      res.clearCookie('authCookie')
      res.render('index', { login: false });
    }else{
      res.render('index', { login: true });
    }

  }else{
    res.render('index', { login: false });
  }
});

module.exports = router;
