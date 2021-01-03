var express = require('express');
var router = express.Router();
const db = require('../mongoCx');


/* GET users listing. */
router.route('/')
    .post(async (req, res) => {
//    let theName = req.body.name;
        let mongo = await db.getDB('foursome');
//    let results = await mongo.collection('names').insert({name: theName});
        let results = await mongo.collection('players').insert(req.body);

        res.send(`Inserted ${req.body.name}`);
    })

module.exports = router;
