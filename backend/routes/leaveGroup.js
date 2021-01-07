var express = require('express');
var router = express.Router();
const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');
var randomstring = require("randomstring");


/* POST route to make a new user and add them to the db
* to-do:
* - add checks for the username being unique, otherwise its gonna break
*
*
*  */
router.route('/').get((req,res,next)=>{
    res.render('leaveGroup')
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
                let groupExist = await mongo.collection('groups').find({groupname: req.body.gname}).toArray();
                if (!groupExist.length)  {
                    //the group doesnt exist, really only gets here if you leave a group that has just been deleted
                    console.log("group does not exist")
                    //should be a dif. response here for angular
                    res.render('leaveGroup');

                }else {

                    let player =
                        {
                            username: results1[0].username

                        }

                    const updateDoc = {
                        $pull: {
                            players: player},
                    };

                    const result = await mongo.collection('groups').updateOne({groupname: req.body.gname}, updateDoc);


                    //message to know the player has left the group
                    console.log("player has been removed from the group__");
                    console.log(result);
                    //should be a dif. response here for angular
                    res.redirect('http://localhost:3000');
                }
            }
        })

module.exports = router;
