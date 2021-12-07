const {verifySignature} = require('../../scripts/jwt');

/**
 * Test for wrong input types
 */
 test('Verify signature should not accept anything but strings', () => {
    expect(() => verifySignature({})).toThrow();
    expect(() => verifySignature(1234)).toThrow();
    expect(() => verifySignature([12, 34])).toThrow();
    expect(() => verifySignature(undefined)).toThrow();
    expect(() => verifySignature(null)).toThrow();
    expect(() => verifySignature(false)).toThrow();
});

/**
 * Test wrong input format
 */
test('Verify signature should only accept string in jwt format (1 dot error)', () => {
    expect(() => verifySignature('test.testtest')).toThrow();
})

/**
 * Test wrong input format
 */
test('Verify signature should only accept string in jwt format (4 dot error)', () => {
    expect(() => verifySignature('test.test.test.test')).toThrow();
})

/**
 * Test wrong input format
 */
test('Verify signature should only accept string in jwt format (bad format)', () => {
    expect(() => verifySignature('.1.2.')).toThrow();
})

/**
 * Test invalid signature
 */
test('Verify signature should return false when signature is wrong', () => {
    expect(verifySignature('test.test.test')).toBe(false);
})

/**
 * Test valid signature
 */
test('Verify signature should return true when signature is a match', () => {
    const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjEyMzQ1Njc4OSwidXNlcl9pZCI6IjAwMDEiLCJyb2xlIjoiU1RVREVOVCJ9.f7d1fc9a63e82cb4e560c9e27611ba8212e84cbf879968f13aa821e1505e017e';
    expect(verifySignature(validToken)).toBe(true);
})


