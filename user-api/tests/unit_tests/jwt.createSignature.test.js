const {createSignature} = require('../../scripts/jwt');

/**
 * Test for wrong input types
 */
 test('Create signature should not accept anything but strings', () => {
    expect(() => createSignature({})).toThrow();
    expect(() => createSignature(1234)).toThrow();
    expect(() => createSignature([12, 34])).toThrow();
    expect(() => createSignature(undefined)).toThrow();
    expect(() => createSignature(null)).toThrow();
    expect(() => createSignature(false)).toThrow();
});

test('Create signature should return string when a string is input', () => {
    expect(typeof createSignature('')).toStrictEqual('string');
})

test('Create signature should return correct hashed signature', () => {
    expect(createSignature('test','super-secret')).toBe('77b8c892ea999026854f4733a90f1be8ac94bf4efb185507d66c5047f8fb4b24');
})