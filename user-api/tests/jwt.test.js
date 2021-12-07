const jwt = require('../scripts/jwt');

test('Base 64 encrypt should encrypt TEST (object) to eyJ0ZXN0IjoiVEVTVCJ9 (string)', () => {
    const expected = 'eyJ0ZXN0IjoiVEVTVCJ9';
    const actual = jwt.base64Encrypt({test: 'TEST'});

    expect(actual).toBe(expected);
})

test('Base 64 encrypt should not accept string input', () => {
    expect(() => jwt.base64Encrypt('string-input')).toThrow();
})