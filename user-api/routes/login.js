var express = require("express");
var router = express.Router();
const {validateEmail,  validatePassword} = require("../scripts/user-data-validation");
const { matchPassword } = require("../scripts/password-manager");
const { getUserByEmail } = require("../database/user-mongo_db");
const { createToken } = require('../scripts/jwt');

/* GET home page. */
router.post("/", async function (req, res, next) {
  const { email, pwd } = req.body;

  if (!validateEmail(email) || !validatePassword(pwd)) {
    res.status(400).send({
      status: "400 - Bad Request",
      message: "One or more values was missing or lacking correct format",
    });
    return;
  }

  user = await getUserByEmail(email);

  if(!user) {
    res.status(400).send({
        status: "400 - Bad Request",
        message: "Wrong username or password",
      });
      return;
  }

  if(!(await matchPassword(pwd, user.pwd))) {
    res.status(400).send({
        status: "400 - Bad Request",
        message: "Wrong username or password",
      });
      return;
  }

  const tokenData = {
    user_id: user._id, 
    role: user.role
  }

  res.set('Authorization', 'JWT: ' + createToken(tokenData)).send({
      status: "200 - OK",
      message: "login successful"
  })
  return;
});

module.exports = router;
