var express = require('express');
var router = express.Router();

const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');
let  md5 = require('md5');
var randomstring = require("randomstring");

/* GET home page. */

router.route('/')
    .post(

        body('course_name').trim().isLength(1).isAlpha(),
        body('slope').trim().isLength(1).isAlpha(),
        body('yardage').trim().isLength(1),
        body('score').trim().isLength(1),
        body('holes_played').trim().isLength(1),
        body('date').trim().isDate(),

        async (req, res) => {
            if(req.cookies.authCookie != undefined){
                let mongo = await db.getDB('foursome');
                let results = await mongo.collection('currentUsers').find({loginsecret: req.cookies.authCookie}).toArray();
                console.log( "results from mongo: " + results);
                if (!results.length)  {
                    //you are not logged in
                    console.log("you are not logged in")
                    res.clearCookie('authCookie')
                    res.render('index', { login: false });

                }else{
                    //you are logged in anthe cookie is legit
                    //code happens below
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return res.status(400).json({ errors: errors.array() });
                    }


                    let round =
                        {
                            course_name: req.body.course_name,
                            yardage: req.body.yardage,
                            score: req.body.score,
                            slope: req.body.slope,
                            holes_played: req.body.holes_played,
                            date_played: req.body.date,
                            golfer: results[0].username


                        }
                    res.clearCookie('authCookie')
                    res.render('index', { login: false });
                }
            }
        })

module.exports = router;
