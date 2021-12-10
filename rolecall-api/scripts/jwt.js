const { createHmac } = require("crypto");
const { jwt } = require("../config");

const hashingAlgoritm = "HS256";

function createToken(payload) {
  if (typeof payload !== "object" || payload === null || Array.isArray(payload))
    throw new Error("Payload must be an object!");

  const header = {
    alg: hashingAlgoritm,
    typ: "JWT",
  };

  payload.iat = new Date().getTime();

  let base64Header = base64Encrypt(header);
  let base64Payload = base64Encrypt(payload);
  let signature = createSignature(base64Header + "." + base64Payload);

  return base64Header + "." + base64Payload + "." + signature;
}

function base64Encrypt(data) {
  if (typeof data !== "object" || data === null || Array.isArray(data))
    throw new Error("Could not encrypt since data was not an object!");
  
  data = JSON.stringify(data);
  let base64String = Buffer.from(data).toString("base64");
  return base64String.split("=").join("").split("+").join("").split("/").join("");
}

function base64Decrypt(data) {
  if (typeof data !== "string")
    throw new Error("Could not decrypt since data is not a String!");
  
  let decoded = Buffer.from(data, "base64").toString("ascii");
  return JSON.parse(decoded);
}

function createSignature(token, secret = jwt.secret) {
  if (typeof token !== "string") throw new Error("Input is not a string!");
  return createHmac("sha256", secret).update(token).digest("hex");
}

function verifySignature(token) {
  if (typeof token !== "string") throw new Error("Input is not a string!");

  // split in header, payload and signature
  const tokenSplitted = token.split(".");

  if (tokenSplitted?.length !== 3)
    throw new Error("JWT is invalid format: \n" + token);

  const expected = createSignature(tokenSplitted[0] + "." + tokenSplitted[1]);
  const actual = tokenSplitted[2];

  //compare the signatures
  return expected === actual;
}

function getTokenData(token, callback) {

  const splittetToken = token.split(".");

  const header = base64Decrypt(splittetToken[0]);
  const payload = base64Decrypt(splittetToken[1]);

  callback(payload, header);
}

module.exports = {
  createToken: createToken,
  base64Encrypt: base64Encrypt,
  base64Decrypt: base64Decrypt,
  createSignature: createSignature,
  verifySignature: verifySignature,
  getTokenData: getTokenData,
};

// for (let i = 0; i < 100; i++) {
    // const payload = {
    //     iat: 7812396464 + i,
    //     user_id: "0000" + String(i),
    //     role: i % 2 == 0 ? "STUDENT" : "TEACHER"
    // }

  //   const payload = {
  //     iat: 123456789,
  //     user_id: "0001",
  //     role: "STUDENT"
  // }

  //    const token = generateJWTToken(payload);
  //    console.log(token);
//     const fakeToken = token + '1';

//     try {
//         getJWTData(token, (body, header) => {

//             console.log("---- " + i + " ----");
//             console.log(body.iat);
//             console.log(body.user_id);
//             console.log(body.role);
//             console.log("\n");
//             console.log(header.alg);
//             console.log(header.typ);
//             console.log("\n");

//         })
//     } catch(err) {
//         console.log(i + err.message);
//     }

// }
