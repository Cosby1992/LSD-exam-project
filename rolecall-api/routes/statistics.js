var express = require('express');
var router = express.Router();

const { getTokenData, verifySignature } = require("../scripts/jwt");
const {
  findLecturesWithTeacher,
  findLecturesWithTeacherInInterval,
  findLecturesWhereStudentIsEnroledInInterval,
  findLecturesWhereStudentIsEnroled,
  findLectureWithTeacherAndStudent,
  findLecturesWithTeacherAndStudentInInterval,
  findLectureWithTeacherAndLectureName,
  findLectureWithTeacherAndLectureNameInInterval,
  findLectureWithTeacherAndStudentAndLectureName,
  findLectureWithTeacherAndStudentAndLectureNameInInterval,
  findLectureWithStudentAndLectureName,
  findLectureWithStudentAndLectureNameInInterval
} = require("../database/lecture-mongo_db");
const { calculateLectureStatistics, calculateStudentAttendance } = require('../scripts/calculate-statistics');

/* GET  */
router.get('/overall/:start?/:end?', async function(req, res, next) {

    const token = checkAuthorization(req.headers.authorization);

    if(!token) {
        sendResponse(res,403,"Forbidden","You are not authorized to use this endpoint, please login first.");
        return;
    }

    const period = handlePeriod(req.params?.start, req.params?.end);

    getTokenData(token, async (payload, header) => {
        let statistics;
        try {
            statistics = await getLectureStatistics(payload, period);
        } catch (err) {
            if(err.message.includes('Invalid input')) {
                sendResponse(res, 400, "Bad Request", err.message);
            } else if (err.message.includes('Not found')) {
                sendResponse(res, 404, "Not Found", err.message);
            }
            return;
        }

        if (statistics) {
          res.send({
            status: "200: OK",
            statistics: statistics,
          });

          return;
        }

        sendResponse(res, 403, "Forbidden", "You are not authorized to use this endpoint, only students and teachers can use this endpoint");
        return;
    })
  
});

router.get('/student/:id/:start?/:end?', async function(req, res, next) {

    const token = checkAuthorization(req.headers.authorization);

    if(!token) {
        sendResponse(res,403,"Forbidden","You are not authorized to use this endpoint, please login first.");
        return;
    }

    const period = handlePeriod(req.params?.start, req.params?.end);

    getTokenData(token, async (payload, header) => {

        if(payload.role !== 'TEACHER') {
            sendResponse(res, 403, "Forbidden", "You are not authorized to use this endpoint, only teachers can use this endpoint");
            return;
        }

        let statistics;

        try {
            if(!period.active) {
                statistics = calculateLectureStatistics(await findLectureWithTeacherAndStudent(payload.user_id, req.params.id))
            } else {
                statistics = calculateLectureStatistics(await findLecturesWithTeacherAndStudentInInterval(payload.user_id, req.params.id, period.start, period.end));
            }
        } catch (err) {
            if(err.message.includes('Invalid input')) {
                sendResponse(res, 400, "Bad Request", err.message);
            } else if (err.message.includes('Not found')) {
                sendResponse(res, 404, "Not Found", err.message);
            }
            return;
        }


        
        if (statistics) {
          res.send({
            status: "200: OK",
            statistics: statistics,
          });
          return;
        }

        sendResponse(res, 404, "Not Found", "The student id was not found in any lectures in the given interval (or student id does not exist)");
        return;
    })
})

router.get('/lecture/byname/:name/:start?/:end?', async function(req, res, next) {

    const token = checkAuthorization(req.headers.authorization);

    if(!token) {
        sendResponse(res,403,"Forbidden","You are not authorized to use this endpoint, please login first.");
        return;
    }

    const period = handlePeriod(req.params?.start, req.params?.end);

    getTokenData(token, async (payload, header) => {

        if(payload.role !== 'TEACHER') {
            if(payload.role === 'STUDENT'){
                next();
                return;  
            } 
            sendResponse(res, 403, "Forbidden", "You are not authorized to use this endpoint, only students and teachers can use this endpoint");
        }

        let statistics;

        try {
            if(!period.active) {
                statistics = calculateLectureStatistics(await findLectureWithTeacherAndLectureName(payload.user_id, req.params.name))
            } else {
                statistics = calculateLectureStatistics(await findLectureWithTeacherAndLectureNameInInterval(payload.user_id, req.params.name, period.start, period.end));
            }
        } catch (err) {
            if(err.message.includes('Invalid input')) {
                sendResponse(res, 400, "Bad Request", err.message);
            } else if (err.message.includes('Not found')) {
                sendResponse(res, 404, "Not Found", err.message);
            }
            return;
        }

        
        if (statistics) {
          res.send({
            status: "200: OK",
            statistics: statistics,
          });
          return;
        }

        sendResponse(res, 404, "Not Found", "The student id was not found in any lectures in the given interval (or student id does not exist)");
        return;
    })
})

router.get('/lecture/byname/:name/:start?/:end?', async function(req, res, next) {

    const token = checkAuthorization(req.headers.authorization);

    if(!token) {
        sendResponse(res,403,"Forbidden","You are not authorized to use this endpoint, please login first.");
        return;
    }

    const period = handlePeriod(req.params?.start, req.params?.end);

    getTokenData(token, async (payload, header) => {

        if(payload.role !== 'STUDENT') {
            sendResponse(res, 403, "Forbidden", "You are not authorized to use this endpoint, only students and teachers can use this endpoint");
        }

        let statistics;

        try {
            if(!period.active) {
                statistics = calculateStudentAttendance(await findLectureWithStudentAndLectureName(payload.user_id, req.params.name), payload.user_id)
            } else {
                statistics = calculateStudentAttendance(await findLectureWithStudentAndLectureNameInInterval(payload.user_id, req.params.name, period.start, period.end), payload.user_id);
            }
        } catch (err) {
            if(err.message.includes('Invalid input')) {
                sendResponse(res, 400, "Bad Request", err.message);
            } else if (err.message.includes('Not found')) {
                sendResponse(res, 404, "Not Found", err.message);
            } else {
                sendResponse(res, 500, "Internal Server Error", err.message);
            }

            return;
        }

        if (statistics) {
          res.send({
            status: "200: OK",
            statistics: statistics,
          });
          return;
        }

        sendResponse(res, 500, "Internal Server Error", "An error occurred while processing your request");
        return;
    })
})

router.get('/lecture/byname/:name/student/:id/:start?/:end?', async function(req, res, next) {

    const token = checkAuthorization(req.headers.authorization);

    if(!token) {
        sendResponse(res,403,"Forbidden","You are not authorized to use this endpoint, please login first.");
        return;
    }

    const period = handlePeriod(req.params?.start, req.params?.end);

    getTokenData(token, async (payload, header) => {

        if(payload.role !== 'TEACHER') {
            sendResponse(res, 403, "Forbidden", "You are not authorized to use this endpoint, only teachers can use this endpoint");
        }

        let statistics;

        try {
            if(!period.active) {
                statistics = calculateLectureStatistics(await findLectureWithTeacherAndStudentAndLectureName(payload.user_id, req.params.id, req.params.name))
            } else {
                statistics = calculateLectureStatistics(await findLectureWithTeacherAndStudentAndLectureNameInInterval(payload.user_id, req.params.id, req.params.name, period.start, period.end));
            }
        } catch (err) {
            if(err.message.includes('Invalid input')) {
                sendResponse(res, 400, "Bad Request", err.message);
            } else if (err.message.includes('Not found')) {
                sendResponse(res, 404, "Not Found", err.message);
            }
            return;
        }

        
        if (statistics) {
          res.send({
            status: "200: OK",
            statistics: statistics,
          });
          return;
        }

        sendResponse(res, 500, "Internal Server Error", "An error occurred while processing your request");
        return;
    })
})

const getLectureStatistics = async (payload, period) => {
    let lectures;
    
    if(payload.role === 'TEACHER' && period.active) {
        lectures = await findLecturesWithTeacherInInterval(payload.user_id, period.start, period.end);

    } else if (payload.role === 'TEACHER' && !period.active) {
        lectures = await findLecturesWithTeacher(payload.user_id);

    } else if (payload.role === 'STUDENT' && period.active) {
        lectures = await findLecturesWhereStudentIsEnroledInInterval(payload.user_id, period.start, period.end);

    } else if (payload.role === 'STUDENT' && !period.active) {
        lectures = await findLecturesWhereStudentIsEnroled(payload.user_id);
    } 

    let statistics;

    if(lectures) {
        if(payload.role === 'STUDENT') statistics = calculateStudentAttendance(lectures, payload.user_id);
        else statistics = calculateLectureStatistics(lectures);
    }
    
    return statistics ? statistics : null;
}

const checkAuthorization = (authHeader) => {
    
    if (!authHeader?.includes("JWT:")) return false;
    
    const token = authHeader?.split(" ")[1];

    if(!verifySignature(token)) return false;

    return token;
}

const handlePeriod = (startString, endString) => {
    var period = {
        active: false,
        start: null,
        end: null
    }

    if(startString && endString && typeof startString == 'string' && typeof endString == 'string') {
        let start = new Date(startString);
        let end = new Date(endString);

        if(!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            period.active = true;
            period.start = start;
            period.end = end;
        }
    }

    return period;
}

const sendResponse = (res, status, statusDescribtion, message) => {
  res.status(status).send({
    status: status + ": " + statusDescribtion,
    message: message,
  });
};

module.exports = router;