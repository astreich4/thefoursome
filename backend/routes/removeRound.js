var express = require('express');
var router = express.Router();

const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');
let  md5 = require('md5');
var randomstring = require("randomstring");

/* GET home page. */

router.route('/').get((req,res,next)=>{
    res.render('removeRound')
})
    .post(


        body('id').trim().isLength(1),


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
                    //gets the player that is using the app from the db
                    let results = await mongo.collection('players').find({username: results1[0].username}).toArray();
                    //checks if the id is good
                    console.log("this is the id:..|"+req.body.id+"|..")
                    console.log(results[0].rounds);
                    let isthere = search(req.body.id,results[0].rounds);
                    if( isthere == true){
                        const updateDoc =
                            { $pull: { rounds: { id: req.body.id  } } };

                        const result = await mongo.collection('players').updateOne({username: results[0].username}, updateDoc);

                        // res.send("added round"); -- //use this bit with angular
                        console.log(result)
                        console.log("removed the round")
                    }else{
                        console.log("round not present")
                    }

                    res.redirect('http://localhost:3000'); //use this while testing with pug
                }
            }
        })

function search(nameKey, myArray){
    for (let i=0; i < myArray.length; i++) {
        if (myArray[i].id === nameKey) {
            return true;
        }
    }
}

module.exports = router;
