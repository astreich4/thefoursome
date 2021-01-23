var express = require('express');
var router = express.Router();

const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');
let  md5 = require('md5');
var randomstring = require("randomstring");

/* GET home page. */

router.route('/').get((req,res,next)=>{
    res.render('addRound')
})
    .post(

        body('course_name').trim().isLength(1).isAlpha('en-US'," -'"),
        body('slope').trim().isLength(1),
        body('yardage').trim().isLength(1),
        body('score').trim().isLength(1),
        body('holes_played').trim().isLength(1),
        body('date').trim().isDate(),

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
                    const errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return res.status(400).json({ errors: errors.array() });
                    }
                    let results = await mongo.collection('players').find({username: results1[0].username}).toArray();


                    //id is a random string + the number it is added in the list, there is a better way to make IDs and I may come back anf fix this
                    let round_id = randomstring.generate(5)+results[0].rounds.length;
                    let round =
                        {
                            course_name: req.body.course_name,
                            yardage: req.body.yardage,
                            score: req.body.score,
                            slope: req.body.slope,
                            holes_played: req.body.holes_played,
                            date_played: req.body.date,
                            golfer: results[0].username,
                            id: round_id


                        }
                    const updateDoc = {
                        $push: {
                            rounds: round},
                    	    };

                    const result = await mongo.collection('players').updateOne({username: results[0].username}, updateDoc);

                    // res.send("added round"); -- //use this bit with angular
                    console.log(result)
                    console.log("added the round")
                    res.redirect('/'); //use this while testing with pug
                }
            }
        })

module.exports = router;
