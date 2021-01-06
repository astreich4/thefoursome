var express = require('express');
var router = express.Router();

const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');
let  md5 = require('md5');
var randomstring = require("randomstring");

/* GET home page. */

router.route('/')
    .get((req,res,next)=>{
        res.render('login')
    })

    .post(
    body('username').trim().isLength(1),
    body('password').trim().isLength(5),


    async (req, res) => {
//    let theName = req.body.name;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //hash the pasword
        let hashedp = md5(req.body.password);
        //get the db
        let mongo = await db.getDB('foursome');
        //find the user
        let results = await mongo.collection('players').find({username: req.body.username}).toArray();
        //if no user return error
        if (!results.length)  {
            res.send('Username or password not found');
        }
        else if(results[0].password === hashedp){
            //creating a simple secret to be passed back and forth to identify this user
            let hashedsec = md5(req.body.username + randomstring.generate(5));
            let currentUser =
                {
                    username: req.body.username,
                    loginsecret: hashedsec,

                }
            //sets the cookie in the response
            res.cookie("authCookie",hashedsec);
            //inserts the current user into the db
            let results = await mongo.collection('currentUsers').insert(currentUser);
            //i think you should only redirect when using the pug tests
            res.redirect('http://localhost:3000');
        }else{
            //here if the password is wrong
            res.send('Username or password not found');
        }
        //let results = await mongo.collection('players').insert(player);

        //res.send(`should not get here`);
    })

module.exports = router;
