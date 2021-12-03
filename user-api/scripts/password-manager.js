const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.hashPassword = async function (pwd) {
    return await bcrypt.hash(pwd, saltRounds)
}

exports.passwordMatch = async function (pwd, hash) {
    return await bcrypt.compare(pwd, hash);
}