const validateEmail = function (email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
};

const validatePassword = function (password) {
  return password?.length > 0 && typeof password === 'string';
}

const validateFirstname = function (firstname) {
  return firstname?.length > 0 && typeof firstname === 'string';
}

const validateLastname = function (lastname) {
  return lastname?.length > 0 && typeof lastname === 'string';
}

const validateDateOfBirth = function (dateOfBirth) {
  const date_of_birth = new Date(dateOfBirth);
  return !isNaN(date_of_birth.getTime());
}

const validateUserData = function (reqBody, cb) {
  const {email, pwd, firstname, lastname, dob} = reqBody;
  var dateOfBirth;

  const dataOk = validateEmail(email) && 
                validatePassword(pwd) &&
                validateFirstname(firstname) &&
                validateLastname(lastname) && 
                validateDateOfBirth(dob);

  if(dataOk && cb) cb(dateOfBirth);

  return dataOk;
}

module.exports = {
  validateUserData: validateUserData,
  validateEmail: validateEmail,
  validatePassword: validatePassword
};