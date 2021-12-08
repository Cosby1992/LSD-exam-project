const {generateCode} = require('../../scripts/code-generator');
const characters = require('../../config').codegeneration.characters;


test('code-generator should produce string of length 4', () => {
    expect(generateCode().length).toStrictEqual(4)
})

test('code-generator should generate string with only specified characters', () => {

    for (const char of generateCode()) {
        expect(characters.includes(char)).toStrictEqual(true);
    }
    
})