const config = require("../config");
const { MongoClient, ObjectId } = require("mongodb");

// Connection URL
const url = "mongodb://" + config.mongodb.host + ":" + config.mongodb.port;
const client = new MongoClient(url);
const dbName = config.mongodb.fakecphdbname;

const createIndexes = async () => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("attendance");

  try {
    await collection.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
  } catch (error) {
    console.log(error);
  }

  try {
    await collection.createIndex({ lecture_id: 1 });
  } catch (error) {
    console.log(error);
  }
};

createIndexes();

// insert an attendance document
exports.publishAttendanceCodeWithTTL = async function (lecture_id, teacher_id, code, ttl = 15) {
  if (
    typeof lecture_id !== "string" ||
    typeof code !== "string" ||
    typeof ttl !== "number"
  ) {
    throw new Error(
      "Invalid input: lecture_id and code must be strings and ttl must be a number"
    );
  }

  // Check if lecture exists with teacher id
  await find('lectures', {_id: ObjectId(lecture_id), teacher_docref: teacher_id})

  // THIS SHOULD BE USED TO CHECK THAT A LECTURE WILL ONLY START IF IT DID NOT ALREADY TAKE PLACE
  // // Check if lecture exists with teacher id
  // await find('lectures', {_id: ObjectId(lecture_id), teacher_docref: teacher_id,  end: {$gte: new Date()}})
  
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("attendance");

  const expire_date = new Date();
  expire_date.setSeconds(expire_date.getSeconds() + ttl);

  return await collection.insertOne({
    lecture_id: lecture_id,
    attendance_code: code,
    expires_at: expire_date,
  });
};

exports.checkIfCodeMatches = async (code, lecture_id) => {
  if (typeof lecture_id !== "string" || typeof code !== "string")
    throw new Error("lecture_id and code must be strings");

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("attendance");

  let attendanceDoc = collection.find({lecture_id: lecture_id});

  if (!await attendanceDoc.hasNext()) {
    throw new Error("The Lecture does not exist");
  }

  while (await attendanceDoc.hasNext()) {
    let currentDoc = await attendanceDoc.next();
    if(currentDoc?.attendance_code === code) {
      return true;
    }
  }

  return false;
};

async function find(collection_name, query) {

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collection_name);
  let result = collection.find(query);
  
  if(!await result.hasNext()) {
      throw new Error('Not found: Nothing found with the given arguments');
  }

  let lectures = [];
  while(await result.hasNext()) {
      lectures.push(await result.next())
  }

  return lectures;
}

