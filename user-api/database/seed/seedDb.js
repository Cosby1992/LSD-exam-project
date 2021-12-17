const {seedUsers} = require('./user-seed');
const {seedLectures} = require('./lectures-seed');

seedDB(199, 9, 500, () => {
    process.exit(0);
});

async function seedDB(numberOfStudents = 199, numberOfTeachers = 9, lecturesPrTeacher = 500, callback) {

    console.log("Start seeding");

    seedUsers(numberOfStudents, numberOfTeachers, async (students, teachers) => {
        await seedLectures(lecturesPrTeacher, students, teachers);

        console.log("Seeding Complete!");
        callback();
    })

} 
    

