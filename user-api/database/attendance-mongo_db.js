const config = require("../config");
const { MongoClient } = require("mongodb");

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
exports.publishAttendanceCodeWithTTL = async function (lecture_id, code, ttl = 15) {
  if (
    typeof lecture_id !== "string" ||
    typeof code !== "string" ||
    typeof ttl !== "number"
  ) {
    throw new Error(
      "lecture_id and code must be strings and ttl must be a number"
    );
  }

  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("attendance");

  const expire_date = new Date();
  expire_date.setSeconds(expire_date.getSeconds() + ttl);

  const inserted = await collection.insertOne({
    lecture_id: lecture_id,
    attendance_code: code,
    expires_at: expire_date,
  });

  console.log(inserted);

  return inserted;
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

// const test = async function () {
//   try {
//     await exports.publishAttendanceCodeWithTTL("1234", "abcd", 30);
//     await exports.publishAttendanceCodeWithTTL("1234", "abce", 30);
//     await exports.publishAttendanceCodeWithTTL("1234", "abcf", 30);
//     await exports.publishAttendanceCodeWithTTL("1234", "abcg", 30);

//     await exports.checkIfCodeMatches("abcga", "1234");
//   } catch (error) {
//     console.log("ERROR");
//     console.log(error);
//   } finally {
//     process.exit(0);
//   }
// };

// test();
