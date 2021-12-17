var express = require("express");
var router = express.Router();

const { getTokenData, verifySignature } = require("../scripts/jwt");
const { applyCodeToLecture } = require('../database/lecture-mongo_db');
const { publishAttendanceCodeWithTTL } = require('../database/attendance-mongo_db');
const { generateCode } = require('../scripts/code-generator');
const {min_ttl, max_ttl} = require('../config').codegeneration;

/* GET home page. */
router.post("/start", async function (req, res, next) {

  const header = req.headers.authorization;

  if (!header?.includes("JWT:"))
    sendResponse(
      res,
      403,
      "Forbidden",
      "You are not authorized to use this endpoint, please login first."
    );

  const token = header?.split(" ")[1];

  if(!verifySignature(token)) {
    sendResponse(res,403,"Forbidden","You are not authorized to use this endpoint, please login first.");
}

  if(!req.body.lecture_id) {
    sendResponse(res, 400, "Bad Request", "lecture_id was not found");
  }

  try {
    getTokenData(token, async (payload, header) => {

      if(payload.role !== 'TEACHER') {
        sendResponse(res, 403, "Forbidden", "You are not authorized to use this endpoint, only teachers can start lectures");
      }
      
      const generatedCode = generateCode();

      let updateResult;

      try {
        if(req.body?.ttl && typeof req.body.ttl === 'number' && req.body.ttl > min_ttl && req.body.ttl < max_ttl) {
          updateResult = await publishAttendanceCodeWithTTL(req.body.lecture_id, payload.user_id, generatedCode, req.body.ttl);
        } else {
          updateResult = await publishAttendanceCodeWithTTL(req.body.lecture_id, payload.user_id, generatedCode)
        }
      } catch (error) {
        if(error.message?.includes('Invalid input')){
          sendResponse(res, 400, "Bad request", `One or more arguments was invalid: ` + error.message);
        } else if (error.message?.includes('Not found')) {
          sendResponse(res, 404, "Not Found", `The lecture was not found or did already end`);
        } else {
          sendResponse(res, 500, "Internal Server Error", error.message);
        }
        
        return;
      }

      if(!updateResult?.acknowledged) {
        console.log("Update result: ");
        console.log(updateResult);
        sendResponse(
          res,
          500,
          "Internal Server Error",
          "There was a problem updating the lecture. Check the lecture_id (string) and try again."
        );
        return;
      }
      
      res.send({
        status: 200,
        message: "OK",
        code: generatedCode
      });

    });
  } catch (err) {
    sendResponse(
      res,
      403,
      "Forbidden",
      "You are using an invalid or expired auth token, please login first."
    );
    return;
  }
});

const sendResponse = (res, status, statusDescribtion, message) => {
  res.status(status).send({
    status: status + ": " + statusDescribtion,
    message: message,
  });
};

module.exports = router;
