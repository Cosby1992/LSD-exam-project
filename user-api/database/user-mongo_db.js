const config = require("../config");
const { MongoClient } = require("mongodb");

// Connection URL
const url = "mongodb://" + config.mongodb.host + ":" + config.mongodb.port;
const client = new MongoClient(url);
const dbName = config.mongodb.userdbname;

// insert a user object in the database
exports.createUser = async function (user) {
  if (typeof user !== "object" || user === null || Array.isArray(user))
    throw new Error("User must be an object!");

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

exports.getUserByEmail = async function (email) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("users");

  const dbResult = await collection.findOne({
    email: email,
  });

  return dbResult;
}
