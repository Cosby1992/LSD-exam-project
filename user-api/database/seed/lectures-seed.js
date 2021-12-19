const { insertLecture } = require("../lecture-mongo_db");

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
  ];

  for (let i = 0; i < insertedTeachers.length; i++) {
    var startTime = new Date();
    startTime.setHours(8);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    startTime.setMilliseconds(0);
    startTime.setMonth(startTime.getMonth() - 2);

    var lastStartTime = startTime;

    for (let j = 0; j < numberOfLecturesPrTeacher; j++) {
      const lecName =
        lectureNames[Math.floor(Math.random() * lectureNames.length)];

      const studentsPrTeacher = parseInt(
        insertedStudents.length / insertedTeachers.length
      );

      var start = i * studentsPrTeacher;
      var end = studentsPrTeacher + i * studentsPrTeacher;

      if (i == insertedTeachers.length - 1) {
        end = insertedStudents.length;
      }

      var endTime = new Date(startTime.getTime() + 45 * 60000);

      var studentClass = insertedStudents.slice(start, end);

      /**
       * generate a number between 1 and 10
       * if over 6,
       * generate number of students to be sick (1-3)
       * remove those students from array
       * attach to object
       */
      const randomBetween0and10 = Math.floor(Math.random() * 10) + 1;
      if (randomBetween0and10 >= 3 && startTime <= new Date()) {
        
        const numberOfSickStudents = Math.floor(Math.random() * 5) + 1;

        var sickStartIndex = Math.floor(Math.random() * studentClass.length);

        if((sickStartIndex + numberOfSickStudents) > studentClass.length) {
          sickStartIndex -= numberOfSickStudents;
        }

        studentClass.splice(sickStartIndex, numberOfSickStudents);

      } else if(startTime > new Date()) {
        studentClass = [];
      }

      const lecture = {
        teacher_docref: insertedTeachers[i],
        students_enroled: insertedStudents.slice(start, end),
        name: lecName,
        start: startTime,
        end: endTime,
        students_checked_in: studentClass,
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
