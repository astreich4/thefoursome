var express = require('express');
var router = express.Router();

const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');
let  md5 = require('md5');
var randomstring = require("randomstring");

/* GET home page. */

router.route('/').get(
        async (req, res) => {
            if(req.cookies.authCookie != undefined){
                let mongo = await db.getDB('foursome');
                let results1 = await mongo.collection('currentUsers').find({loginsecret: req.cookies.authCookie}).toArray();
                console.log( "results from mongo: " + results1);
                if (!results1.length)  {
                    //you are not logged in
                    console.log("you are not logged in")
                    res.clearCookie('authCookie')
                    res.render('index', { login: false });

                }else{
                    //you are logged in and the cookie is legit
                    //code happens below

                    //gets the player that is using the app from the db
                    let results = await mongo.collection('players').find({username: results1[0].username}).toArray();
                    //log the rounds
                    console.log(typeof results[0].rounds);
                    //use this while testing with pug
                    res.render('getRounds', { roundstoPug: JSON.stringify(results[0].rounds) });
                    //will probably use something like res.json(results[0].rounds) for angular after the backend is done
                }
            }
        })



module.exports = router;
