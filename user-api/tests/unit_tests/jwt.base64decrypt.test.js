const {base64Decrypt} = require('../../scripts/jwt');

/**
 * Test for wrong input types
 */
 test('Base 64 decrypt should not accept anything but a string', () => {
    expect(() => base64Decrypt(1234)).toThrow('data is not a String');
    expect(() => base64Decrypt([12, 34])).toThrow('data is not a String');
    expect(() => base64Decrypt(undefined)).toThrow('data is not a String');
    expect(() => base64Decrypt(null)).toThrow('data is not a String');
    expect(() => base64Decrypt(false)).toThrow('data is not a String');
    expect(() => base64Decrypt({})).toThrow('data is not a String');
});

/**
 * Test for correct input and output type
 */
 test('Base64Decrypt should decrypt valid base64 string to object', () => {
    const expected = {test: "TEST"};
    const actual = base64Decrypt('eyJ0ZXN0IjoiVEVTVCJ9');

    expect(typeof actual).toStrictEqual('object');
    expect(actual).toStrictEqual(expected);
})

/**
 * Test that it throws an error on a wrong input string
 */
 test('Base 64 decrypt should throw JSON error on invalid base64 encrypted string', () => {
    expect(() => base64Decrypt('eayaJa0aZaXaNa0aIajaoaiaVaEaVaTaVaCaJa9')).toThrow('JSON');
})