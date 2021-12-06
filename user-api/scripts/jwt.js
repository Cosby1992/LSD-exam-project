const { createHmac } = require("crypto");
const { jwt } = require("../config");

const payload = {
    iat: 78123964648,
    user_id: "001",
    role: "STUDENT"
}

function generateJWTToken(payload) {

    const header = {
        alg: "HS256",
        typ: "JWT"
    };

    let base64Header = base64Encrypt(header);
    let base64Payload = base64Encrypt(payload);
    let signature = hmac256Hash(base64Header + '.' + base64Payload);

    return base64Header + '.' + base64Payload + '.' + signature;
}

let token = generateJWTToken(payload);
console.log(token);

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

function hmac256Hash(string) {
  return createHmac("sha256", jwt.secret).update(string).digest("hex");
}
