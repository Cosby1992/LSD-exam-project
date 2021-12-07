var express = require("express");
var router = express.Router();
const {validateEmail,  validatePassword} = require("../scripts/user-data-validation");
const { matchPassword } = require("../scripts/password-manager");
const { getUserByEmail } = require("../database/user-mongo_db");
const { createToken } = require('../scripts/jwt');

/* GET home page. */
router.get("/", async function (req, res, next) {
  const { email, pwd } = req.body;

  if (!validateEmail(email) || !validatePassword(pwd)) {
    res.status(400).send({
      status: "400 - Bad Request",
      message: "One or more values was missing or lacking correct format",
    });
  }

  user = await getUserByEmail(email);

  if(!user) {
    res.status(400).send({
        status: "400 - Bad Request",
        message: "Wrong username or password",
      });
  }

  if(!(await matchPassword(pwd, user.pwd))) {
    res.status(400).send({
        status: "400 - Bad Request",
        message: "Wrong username or password",
      });
  }

  res.set('Authorization', 'JWT: ' + createToken(user)).send({
      status: "200 - OK",
      message: "login successful"
  })
});

module.exports = router;
