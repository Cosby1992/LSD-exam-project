const {seedUsers} = require('./user-seed');
const {seedLectures} = require('./lectures-seed');

async function seedDB(numberOfStudents = 200, numberOfTeachers = 20, lecturesPrTeacher = 100) {

    console.log("Here we go mate");

    seedUsers(numberOfStudents, numberOfTeachers, (students, teachers) => {

        console.log(students.length);
        console.log(teachers.length);

        seedLectures(lecturesPrTeacher, students, teachers);
    })
} 

seedDB(400, 40, 200);