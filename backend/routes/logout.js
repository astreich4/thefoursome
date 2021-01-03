var express = require('express');
var router = express.Router();

const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');
let  md5 = require('md5');
var randomstring = require("randomstring");

/* GET home page. */

router.route('/')
    .post(
        async (req, res) => {
//

            if(req.cookies.authCookie != undefined){
                let mongo = await db.getDB('foursome');
                let results = await mongo.collection('currentUsers').find({loginsecret: req.cookies.authCookie}).toArray();
                console.log( "results from mongo: " + results);
                if (!results.length)  {
                    //should get here but if it runs it creates no problems
                    console.log("things happened out of order...")
                    res.clearCookie('authCookie')
                    res.render('index', { login: false });

                }else{
                    //removes you from the current users list
                    let results = await mongo.collection('currentUsers').deleteOne({loginsecret: req.cookies.authCookie});

                    res.clearCookie('authCookie')
                    res.render('index', { login: false });
                }
            }
        })

module.exports = router;
