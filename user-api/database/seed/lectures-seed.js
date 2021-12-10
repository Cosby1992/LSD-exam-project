const config = require("../../config");
const { MongoClient } = require("mongodb");
const faker = require("faker");

const { insertLecture } = require('../lecture-mongo_db');

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

  const lectureNames = [
    "Large System Development",
    "Test",
    "System Integration",
    "Data Science",
    "Math and Algorithms",
    "Exploration and Presentation",
    "Databases for Developers",
    // "Finance",
    // "Architechture",
    // "Innovation",
    // "Business Modelling",
    // "Business Engineering",
    // "Web-design",
    // "Entrepreneurship",
    // "Business Management",
    // "Programming",
    // "English",
    // "Math",
    // "Physics",
    // "Chemistry",
    // "Microbiology",
    // "Electronic Engineering",
  ];
  
  for (let i = 0; i < insertedTeachers.length; i++) {
    var startTime = new Date(2021, 01, 01, 8, 0, 0, 0);
    var lastStartTime = startTime;

    for (let j = 0; j < numberOfLecturesPrTeacher; j++) {

      const lecName =
        lectureNames[Math.floor(Math.random() * lectureNames.length)];

      const studentsPrTeacher = parseInt(
        insertedStudents.length / insertedTeachers.length
      );

      var start = i * studentsPrTeacher;
      var end = studentsPrTeacher + i * studentsPrTeacher;
      
      if(i == insertedTeachers.length - 1) {
        end = insertedStudents.length;
      }

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
