var express = require('express');
var router = express.Router();
const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');
let  md5 = require('md5');
var randomstring = require("randomstring");


/* POST route to make a new user and add them to the db
* to-do:
* - add checks for the username being unique, otherwise its gonna break
*
*
*  */
router.route('/').get((req,res,next)=>{
    res.render('newGroup')
})
    .post(
        body('gname').trim().isLength(1),

        async (req, res) => {
            let mongo = await db.getDB('foursome');
            let results1 = await mongo.collection('currentUsers').find({loginsecret: req.cookies.authCookie}).toArray();
            console.log( "results from mongo: " + results1);
            if (!results1.length)  {
                //you are not logged in
                console.log("you are not logged in")
                res.clearCookie('authCookie')
                res.render('index', { login: false });

            }else {
                //you are logged in and the cookie is legit
                //code happens below
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()});
                }
                let isNameTaken = await mongo.collection('groups').find({groupname: req.body.gname}).toArray();
                if (isNameTaken.length >0 )  {
                    //you are not logged in
                    console.log("group name already taken")
                    //should be a dif. response here for angular
                    res.render('newGroup');

                }else{
                    let group =
                        {
                            groupname: req.body.gname,
                            admin: results1[0].username,
                            passphrase: randomstring.generate(5),
                            players: [results1[0].username]

                        }
                    let mongo = await db.getDB('foursome');
//                   let results = await mongo.collection('names').insert({name: theName});
                    let results = await mongo.collection('groups').insert(group);

                    //message to know group has been created
                    console.log("group has been created");
                    //should be a dif. response here for angular
                    res.redirect('http://localhost:3000');
                    }
                }
        })

module.exports = router;
