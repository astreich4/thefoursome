var express = require('express');
var router = express.Router();
const db = require('../mongoCx');
const { body, validationResult } = require('express-validator');


/* GET users listing. */
router.route('/')
    .post(
        body('firstname').isLength(1).isAlpha(),
        body('lastname').isLength(1).isAlpha(),


        async (req, res) => {
//    let theName = req.body.name;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            let player =
                {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname

                }
        let mongo = await db.getDB('foursome');
//    let results = await mongo.collection('names').insert({name: theName});
        let results = await mongo.collection('players').insert(player);

        res.send(`Inserted ${player}`);
    })

module.exports = router;
