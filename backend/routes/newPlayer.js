var express = require('express');
var router = express.Router();
const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');
let  md5 = require('md5');


/* POST route to make a new user and add them to the db
* to-do:
* - add checks for the username being unique, otherwise its gonna break
*
*
*  */
router.route('/')
    .post(
        body('firstname').trim().isLength(1).isAlpha(),
        body('lastname').trim().isLength(1).isAlpha(),
        body('username').trim().isLength(1),
        body('password').trim().isLength(5),


        async (req, res) => {
//    let theName = req.body.name;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let hashedp = md5(req.body.password);

            let player =
                {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    username: req.body.username,
                    password: hashedp

                }
        let mongo = await db.getDB('foursome');
//    let results = await mongo.collection('names').insert({name: theName});
        let results = await mongo.collection('players').insert(player);

        res.send(`Inserted ${player}`);
    })

module.exports = router;
