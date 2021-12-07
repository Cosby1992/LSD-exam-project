
const { ExpectationFailed } = require('http-errors');
const {hashPassword, matchPassword: validatePassword} = require('../../scripts/password-manager');

test('check pleaaase', () => {
    expect('check').not.toBe('pleaaase');
})