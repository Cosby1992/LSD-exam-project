const characters = require('../config').codegeneration.characters;

exports.generateCode = function(length = 4) {

    // const uppercase = (Math.random() * 1)

    // console.log(uppercase);

    var code = "";

    for (let i = 0; i < length; i++) {
        // generate random number between 0 and characters array length
        const charIndex = Math.floor(Math.random() * characters.length); 
        // concat the corresponding character
        code += characters[charIndex];
        
    }

    return code;


}