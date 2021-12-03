const config = require("../config");

const { MongoClient } = require("mongodb");

// Connection URL
const url = "mongodb://" + config.db.host + ":" + config.db.port;
const client = new MongoClient(url);
const dbName = config.db.name;

// insert a user object in the database
exports.createInUsers = async function (user) {
  if (!user) throw new Error("User must be an object!");

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("users");
  const inserted = await collection.insertOne(user);

  return inserted;
};

// Check if an email already exists in the database
exports.checkForDuplicateEmail = async function (email) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("users");

  const dbResult = await collection.findOne({
    email: email,
  });

  return dbResult;
};
