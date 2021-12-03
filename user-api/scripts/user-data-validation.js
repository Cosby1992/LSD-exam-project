const validateEmail = function (email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const validateUserData = function (reqBody, cb) {
  var dataOk = true;
  const {email, pwd, firstname, lastname, dob} = reqBody;
  var dateOfBirth;

  if(!validateEmail(email)) dataOk = false;
  if(pwd?.length <= 0) dataOk = false;
  if(firstname?.length <= 0) dataOk = false;
  if(lastname?.length <= 0) dataOk = false;
  dateOfBirth = new Date(dob);
  if(isNaN(dateOfBirth.getTime())) dataOk = false;

  if(dataOk && cb) cb(dateOfBirth);

  return dataOk;
}

module.exports = validateUserData;