var express = require("express");
var router = express.Router();

const { getTokenData } = require("../scripts/jwt");
const { registerStudentAttendance, getLectureCode } = require('../database/lecture-mongo_db');
const { checkIfCodeMatches } = require('../database/attendance-mongo_db');

/* GET home page. */
router.post("/checkin", async function (req, res, next) {

  const { lecture_id, attendance_code } = req.body;

  if (!lecture_id || !attendance_code) {
    sendResponse(res, 400, "Bad Request", "lecture_id or attendance_code was not found");
    return;
  }

  const header = req.headers.authorization;

  if (!header?.includes("JWT:")) {
    sendResponse(res, 403, "Forbidden", "You are not authorized to use this endpoint, please login first.");
    return;
  }


  const token = header?.split(" ")[1];

  try {
    getTokenData(token, async (payload, header) => {

      if (payload.role !== 'STUDENT') {
        sendResponse(res, 403, "Forbidden", "You are not authorized to use this endpoint, only students can start lectures");
        return;
      }

      let codeMatches;

      try {
        codeMatches = await checkIfCodeMatches(attendance_code, lecture_id);
      } catch (error) {
        sendResponse(res, 404, `Not Found`, `The lecture with id: ${lecture_id} is not open for attendance registration`);
        return;
      }

      if (!codeMatches) {
        sendResponse(res, 400, "Bad Request", "The lecture attendance code does not match the provided attendance code");
        return;
      }

      let inserted;
      try {
        inserted = await registerStudentAttendance(payload.user_id, lecture_id);
      } catch (error) {
        sendResponse(res, 404, "Not Found", "The lecture or user does not exist in the database");
        return;
      }

      if (!inserted?.acknowledged) {
        sendResponse(res, 500, "Internal Server Error", "Failed to check in student in the lecture");
        return;
      }

      if (inserted?.modifiedCount === 0) {
        sendResponse(res, 208, 'Already Reported', `The student is already checked in to lecture with id: ${lecture_id}`);
        return;
      }

      sendResponse(res, 200, 'OK', `The student was successfully checked in to lecture with id: ${lecture_id}`);
      return;

    });
  } catch (err) {
    sendResponse(res, 403, "Forbidden", "You are using an invalid or expired auth token, please login first.");
  }

});

const sendResponse = (res, status, statusDescribtion, message) => {
  res.status(status).send({
    status: status + ": " + statusDescribtion,
    message: message,
  });
};

module.exports = router;
