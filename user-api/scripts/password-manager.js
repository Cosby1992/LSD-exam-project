const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.hashPassword = async function (pwd) {
    return await bcrypt.hash(pwd, saltRounds)
}

exports.matchPassword = async function (pwd, hash) {
    return await bcrypt.compare(pwd, hash);
}