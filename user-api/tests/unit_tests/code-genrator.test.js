const {generateCode} = require('../../scripts/code-generator');


test('code-generator should produce string of length 4', () => {
    expect(generateCode().length).toStrictEqual(4)
})