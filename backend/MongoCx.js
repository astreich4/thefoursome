let dbEndpoint = require('./config/dbEndpoint');

const mongoClient = require('mongodb').MongoClient;
const mongoURL = dbEndpoint.dburl;

let _db = null;

module.exports = {
    getDB: async dbName => {
        if (_db)  { return _db; }
        else {
            const client = new mongoClient(mongoURL, { useNewUrlParser: true });
            let _mongo  = await client.connect();
            _db = await _mongo.db(dbName)
            return _db;
        }
    }
}
