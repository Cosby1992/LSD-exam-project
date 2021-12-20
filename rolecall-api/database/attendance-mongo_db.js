const config = require("../config");
const { MongoClient, ObjectId } = require("mongodb");

// Connection URL
const url = "mongodb://" + config.mongodb.host + ":" + config.mongodb.port;
const client = new MongoClient(url);
const dbName = config.mongodb.fakecphdbname;

// Create important indexes if they do not exist
const createIndexes = async () => {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("attendance");

  // Set time to live on the documents
  try {
    await collection.createIndex({ expires_at: 1 }, { expireAfterSeconds: 0 });
  } catch (error) {
    console.log(error);
  }

  // Create index on lecture_id, since this is used to query the database
  try {
    await collection.createIndex({ lecture_id: 1 });
  } catch (error) {
    console.log(error);
  }
};

createIndexes();

// Insert an attendance document
exports.publishAttendanceCodeWithTTL = async function (lecture_id, teacher_id, code, ttl = 15) {
  // Check params
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
  
  // Connect to the database
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("attendance");

  // Create the expiration date using time to live
  const expire_date = new Date();
  expire_date.setSeconds(expire_date.getSeconds() + ttl);

  // Insert the document and return the result from the db
  return await collection.insertOne({
    lecture_id: lecture_id,
    attendance_code: code,
    expires_at: expire_date,
  });
};

// Check if a code exists with the lecture id in the attendance db
exports.checkIfCodeMatches = async (code, lecture_id) => {
  // Check params
  if (typeof lecture_id !== "string" || typeof code !== "string")
    throw new Error("lecture_id and code must be strings");

  // Connect to the database
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("attendance");

  // Query for lecture
  let attendanceDoc = collection.find({lecture_id: lecture_id});

  // If it does not exist
  if (!await attendanceDoc.hasNext()) {
    throw new Error("The Lecture does not exist");
  }

  // If the lecture exist, check if the code matches
  // OBS multiple codes can be valid at the same time
  while (await attendanceDoc.hasNext()) {
    let currentDoc = await attendanceDoc.next();
    if(currentDoc?.attendance_code === code) {
      // Return true if the code matches one of the found lectures
      return true;
    }
  }

  // If the code does not match
  return false;
};

// Method to query the db
async function find(collection_name, query) {

  // Connect 
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collection_name);
  let result = collection.find(query);
  
  // If nothing is found
  if(!await result.hasNext()) {
      throw new Error('Not found: Nothing found with the given arguments');
  }

  // Add what is found to array
  let lectures = [];
  while(await result.hasNext()) {
      lectures.push(await result.next())
  }

  // Return results as array
  return lectures;
}

