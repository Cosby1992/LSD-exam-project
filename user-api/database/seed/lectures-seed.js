const config = require("../../config");
const { MongoClient } = require("mongodb");
const faker = require("faker");

// Connection URL
const url = "mongodb://" + config.mongodb.host + ":" + config.mongodb.port;
const client = new MongoClient(url);
const dbName = config.mongodb.fakecphdbname;

module.exports.seedLectures = async function seedLectures(
  numberOfLecturesPrTeacher = 100,
  insertedStudents = [],
  insertedTeachers = []
) {
  console.log(
    "Seeding " +
      numberOfLecturesPrTeacher * insertedTeachers.length +
      " lectures"
  );
  
  for (let i = 0; i < insertedTeachers.length; i++) {
    var startTime = new Date(2021, 01, 01, 8, 0, 0, 0);
    var lastStartTime = startTime;

    for (let j = 0; j < numberOfLecturesPrTeacher; j++) {
      lectureNames = [
        "Large System Development",
        "Test",
        "System Integration",
        "Data Science",
        "Math and Algorithms",
        "Exploration and Presentation",
        "Databases for Developers",
        "Finance",
        "Architechture",
        "Innovation",
        "Business Modelling",
        "Business Engineering",
        "Web-design",
        "Entrepreneurship",
        "Business Management",
        "Programming",
        "English",
        "Math",
        "Physics",
        "Chemistry",
        "Microbiology",
        "Electronic Engineering",
      ];

      const lecName =
        lectureNames[Math.floor(Math.random() * lectureNames.length)];

      const studentsPrTeacher = parseInt(
        insertedStudents.length / insertedTeachers.length
      );

      var start = 0 + i * studentsPrTeacher;
      var end = studentsPrTeacher + i * studentsPrTeacher;

      var endTime = new Date(startTime.getTime() + 45 * 60000);

      const lecture = {
        teacher_docref: insertedTeachers[i],
        students_enroled: insertedStudents.slice(start, end),
        name: lecName,
        start: startTime,
        end: endTime,
      };

      await insertLecture(lecture);

      if (endTime.getHours() > 15) {
        startTime = new Date(lastStartTime.getTime() + 24 * 60 * 60000);
        lastStartTime = startTime;
      } else {
        startTime = endTime;
      }
    }
  }
};

async function insertLecture(lecture) {
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("lectures");
  const inserted = await collection.insertOne(lecture);
  return inserted;
}
