const {seedUsers} = require('./user-seed');
const {seedLectures} = require('./lectures-seed');

seedDB(50, 5, 100, () => {
    process.exit(0);
});

async function seedDB(numberOfStudents = 200, numberOfTeachers = 20, lecturesPrTeacher = 100, callback) {

    console.log("Start seeding");

    seedUsers(numberOfStudents, numberOfTeachers, async (students, teachers) => {
        await seedLectures(lecturesPrTeacher, students, teachers);

        console.log("Seeding Complete!");
        callback();
    })

} 
    

