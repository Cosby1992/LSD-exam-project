const config = require("../../config");
const { MongoClient } = require("mongodb");
const faker = require("faker");
const { createUser } = require("../user-mongo_db");
const { hashPassword } = require("../../scripts/password-manager");

// Connection URL
const url = "mongodb://" + config.mongodb.host + ":" + config.mongodb.port;
const client = new MongoClient(url);
const dbName = config.mongodb.userdbname;

module.exports.seedUsers = async function seedUsers(
  students = 200,
  teachers = 20,
  callback
) {
  console.log("Seeding " + students + " students");
  const insertedStudents = await newUserLoop(students, "STUDENT");

  console.log("Seeding " + teachers + " teachers");
  const insertedTeachers = await newUserLoop(teachers, "TEACHER");

  console.log("Users seed complete!");
  
  callback(insertedStudents, insertedTeachers);
};

async function newUserLoop(amount, type = "STUDENT") {
  var insertedArray = [];

  for (let i = 0; i < amount; i++) {
    const dobArr = faker.date
      .between("1980-01-01", "2017-01-01")
      .toLocaleDateString()
      .split(".");

    const student = {
      email: faker.internet.email(),
      pwd: faker.internet.password(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      dob: dobArr[2] + "-" + dobArr[1] + "-" + dobArr[0],
    };

    await createUser({
      email: student.email,
      pwd: await hashPassword(student.pwd),
      firstname: student.firstname,
      lastname: student.lastname,
      date_of_birth: student.dob,
      user_role: type,
    }).then((user) => {
      insertedArray.push(user.insertedId.toString());
    });
  }

  return insertedArray;
}
