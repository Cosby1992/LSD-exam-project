const { createHmac } = require("crypto");
const { jwt } = require("../config");

const hashingAlgoritm = "HS256";

function generateJWTToken(payload) {

    const header = {
        alg: hashingAlgoritm,
        typ: "JWT"
    };

    let base64Header = base64Encrypt(header);
    let base64Payload = base64Encrypt(payload);
    let signature = createSignature(base64Header + '.' + base64Payload);

    return base64Header + '.' + base64Payload + '.' + signature;
}

function base64Encrypt(data) {
  if (data instanceof Object) {
    data = JSON.stringify(data);
    let base64String = Buffer.from(data).toString("base64");
    return base64String.split("=").join("").split("+").join("").split("/").join("");
  }
  throw new Error("Could not encrypt since data was not an object!");
}

function base64Decrypt(data) {
  if (typeof data === "string") {
    let decoded = Buffer.from(data, "base64").toString("ascii");
    return JSON.parse(decoded);
  }
  throw new Error("Could not decrypt since data is not a String!");
}

function createSignature(string) {
  return createHmac('sha256', jwt.secret).update(string).digest("hex");
}

function verifySignature(token) {

    if(typeof token !== 'string') throw new Error('JWT is not a string!');

    // split in header, payload and signature
    const tokenSplitted = token.split('.');

    if(tokenSplitted?.length !== 3) throw new Error("JWT is invalid format: \n" + token);

    const expected = createSignature(tokenSplitted[0] + '.' + tokenSplitted[1]);
    const actual = tokenSplitted[2];

    //compare the signatures
    return expected === actual;
}

function getJWTData(token, callback) {
    
    if(!verifySignature(token)) throw new Error('Failed to verify the token');

    const splittetToken = token.split('.');
    
    const header = base64Decrypt(splittetToken[0]);
    const payload = base64Decrypt(splittetToken[1]);

    callback(payload, header);
}

for (let i = 0; i < 100; i++) {
    const payload = {
        iat: 7812396464 + i,
        user_id: "0000" + String(i),
        role: i % 2 == 0 ? "STUDENT" : "TEACHER"
    }

    const token = generateJWTToken(payload);
    const fakeToken = token + '1';
    
    try {
        getJWTData(token, (body, header) => {

            console.log("---- " + i + " ----");
            console.log(body.iat);
            console.log(body.user_id);
            console.log(body.role);
            console.log("\n");
            console.log(header.alg);
            console.log(header.typ);
            console.log("\n");
    
        })
    } catch(err) {
        console.log(i + err.message);
    }
    
}




