var express = require('express');
var router = express.Router();

const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');
let  md5 = require('md5');
var randomstring = require("randomstring");

/* GET home page. */

router.route('/').get((req,res,next)=>{
    res.render('getGroupRounds', { roundstoPug: "...not yet found..." })
}).post(
    body('gname').trim().isLength(1),
    
    async (req, res) => {
        if(req.cookies.authCookie != undefined){
            let mongo = await db.getDB('foursome');
            let cur_user = await mongo.collection('currentUsers').find({loginsecret: req.cookies.authCookie}).toArray();
            console.log( "results from mongo: " + cur_user);
            if (!cur_user.length)  {
                //you are not logged in
                console.log("you are not logged in")
                res.clearCookie('authCookie')
                res.render('index', { login: false });

            }else{
                //you are logged in and the cookie is legit
                //code happens below

                //gets the player that is using the app from the db
                let results = await mongo.collection('groups').find({groupname: req.body.gname}).toArray();
                let rounds = await getRounds(results[0], cur_user[0].username);

                //log the rounds
                console.log(rounds.groupRounds);
                //use this while testing with pug
                res.render('getGroupRounds', { roundstoPug: JSON.stringify(rounds.groupRounds) });
                //will probably use something like res.json(results[0].rounds) for angular after the backend is done
            }
        }
    })

let getRounds = async (group, current_user) => {

    //creates a return object
    let rounds_obj =
        {
            groupRounds: []

        }

        //iterates over the list of players in the group
    for(let player_i in group.players){
        //pulls each player from the db
        let player_db = await mongo.collection('players').find({username: player_i}).toArray();
        //adds the last 3 rounds in the list to the big list
        rounds_obj.groupRounds.push(player_db[0].rounds.splice(-1)[0]);
        rounds_obj.groupRounds.push(player_db[0].rounds.splice(-1)[1]);
        rounds_obj.groupRounds.push(player_db[0].rounds.splice(-1)[2]);
    }

    return rounds_obj;
}

module.exports = router;
