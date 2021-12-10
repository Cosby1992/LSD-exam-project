var express = require('express');
var router = express.Router();

const { getTokenData, verifySignature } = require("../scripts/jwt");
const { findLecturesWithTeacher, findLecturesWithTeacherInInterval } = require('../database/lecture-mongo_db');
const { calculateLectureStatistics } = require('../scripts/calculate-statistics');

/* GET  */
router.get('/overall', async function(req, res, next) {

    const header = req.headers.authorization;

    if (!header?.includes("JWT:")){
        sendResponse(res,403,"Forbidden","You are not authorized to use this endpoint, please login first.");
        return;
    }

    const token = header?.split(" ")[1];

    if(!verifySignature(token)) {
        sendResponse(res,403,"Forbidden","You are not authorized to use this endpoint, please login first.");
        return;
    }

    var period = {
        active: false,
        start: null,
        end: null
    }

    if(req.body.start && req.body.end && typeof req.body.start == 'string' && typeof req.body.end == 'string') {
        let start = new Date(req.body.start);
        let end = new Date(req.body.end);

        console.log(start);
        console.log(end);

        if(!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            period.active = true;
            period.start = start;
            period.end = end;
        }
    }

    getTokenData(token, async (payload, header) => {

        if(payload.role === 'TEACHER' && period.active) {
            let lectures = await findLecturesWithTeacherInInterval(payload.user_id, period.start, period.end);
            let lectureStatistics = calculateLectureStatistics(lectures);
            res.send({
                status: "200: OK",
                statistics: lectureStatistics,
            })
            return;
        } else if (payload.role === 'TEACHER' && !period.active) {
            let lectures = await findLecturesWithTeacher(payload.user_id);
            let lectureStatistics = calculateLectureStatistics(lectures);
            res.send({
                status: "200: OK",
                statistics: lectureStatistics,
            })
            return;
        } else if (payload.role === 'STUDENT') {

            //TODO: implement overall statistics for student (with and without period as with the teacher above)

            sendResponse(res,501,"Not implemented","This functionality has not been implemented for students yet.");
            return;
        }

        sendResponse(res,403,"Forbidden","You are not authorized to use this endpoint, only students and teachers can use this endpoint");
        return;
    })
  
});

//TODO: Endpoint for statistics for single student

//TODO: Endpoint for statistics for a single lecture_name (eg. "Databases for developers")

//TODO: Endpoint for statistics for a student in a lecture_name

//TODO: Endpoint for statistics for a student with teacher_id (teacher_docref)

const sendResponse = (res, status, statusDescribtion, message) => {
  res.status(status).send({
    status: status + ": " + statusDescribtion,
    message: message,
  });
};

module.exports = router;