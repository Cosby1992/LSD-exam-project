var express = require("express");
var router = express.Router();
const validateUserData = require("../scripts/user-data-validation");
const {hashPassword} = require("../scripts/password-manager");
const {
  checkForDuplicateEmail,
  createUser,
} = require("../database/user-mongo_db");

/* GET users index. UNUSED FOR NOW */
router.get("/", async function (req, res, next) {
  res.status(501).send({
    status: "501 - Not Implemented",
  });
});

/**
 * Create a new Teacher
 */
router.post("/teacher/create", async function (req, res, next) {
  // Check if all data is there, and follows business rules
  let dataOk = validateUserData(req.body, (dateOfBirth) => {
    req.body.dob = dateOfBirth;
  });

  // if data is missing or is corrupted
  if (!dataOk) {
    res.status(400).send({
      status: "400 - Bad Request",
      message: "One or more values was missing or lacking correct format.",
    });
  }

  // Check for duplicate email in database
  if (await checkForDuplicateEmail(req.body.email)) {
    res.status(409).send({
      status: "409 - Duplicate Entry",
      message: "The email already exists in the database",
    });

    return;
  }

  // Try to save user to database
  try {
    const insertedUser = await createUser({
      email: req.body.email,
      pwd: await hashPassword(req.body.pwd),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      date_of_birth: req.body.dob,
      user_role: "TEACHER",
    });

    // If success, return 200 and inserted id
    res.send({
      status: "200 - OK",
      message: "The user was saved to the database.",
      insertedId: insertedUser.insertedId,
    });

    return;
  } catch (err) {
    console.log(err);
    // If there was an error persisting the user in the database
    res.status(500).send({
      status: "500 - Internal Server Error",
      message: "There was a problem when trying to save user to database.",
    });
  }
});

/**
 * Create a new Student
 */
router.post("/student/create", async function (req, res, next) {
  // Check if all data is there, and follows business rules
  let dataOk = validateUserData(req.body, (dateOfBirth) => {
    req.body.dob = dateOfBirth;
  });

  // if data is missing or is corrupted
  if (!dataOk) {
    res.status(400).send({
      status: "400 - Bad Request",
      message: "One or more values was missing or lacking correct format.",
    });
  }

  // Check for duplicate email in database
  if (await checkForDuplicateEmail(req.body.email)) {
    res.status(409).send({
      status: "409 - Duplicate Entry",
      message: "The email already exists in the database",
    });
    return;
  }

  // Try to save user to database
  try {
    const insertedUser = await createInUsers({
      email: req.body.email,
      pwd: await hashPassword(req.body.pwd),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      date_of_birth: req.body.dob,
      user_role: "STUDENT",
    });

    // If success, return 200 and inserted id
    res.send({
      status: "200 - OK",
      message: "The user was saved to the database.",
      insertedId: insertedUser.insertedId,
    });

    return;
  } catch (err) {
    console.log(err);
    // If there was an error persisting the user in the database
    res.status(500).send({
      status: "500 - Internal Server Error",
      message: "There was a problem when trying to save user to database.",
    });
  }
});

module.exports = router;
