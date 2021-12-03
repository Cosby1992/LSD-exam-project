var express = require('express');
var router = express.Router();
const config = require('../config');

const { MongoClient } = require('mongodb');

// Connection URL
const url = 'mongodb://' + config.db.host + ':' + config.db.port;
const client = new MongoClient(url);

// Database Name
const dbName = config.db.name;

/* GET users listing. */
router.get('/', async function(req, res, next) {

  // Use connect method to connect to the server
  await client.connect();
  console.log('Successfully connected to database');
  const db = client.db(dbName);
  const collection = db.collection('users');

  const allUsers = await collection.find({}).toArray();

  res.send({
    users: allUsers
  });

});

module.exports = router;
