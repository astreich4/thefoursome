var express = require('express');
var router = express.Router();

const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');

/* GET home page. */

router.route('/').get((req,res,next)=>{
    res.render('getPlayer')
})
    .post(

        body('uname').trim().isLength(1),

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
                    let results = await mongo.collection('players').find({username: req.body.uname}).toArray();

                    res.render('getPlayer', { playerdata: JSON.stringify(results[0]) });

                }
            }
        })

module.exports = router;
