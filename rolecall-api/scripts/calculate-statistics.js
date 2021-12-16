const { findLectureWithTeacherAndStudent, findLectureWithTeacherAndLectureName } = require('../database/lecture-mongo_db');

exports.calculateStudentAttendance = function (lectures, student_id) {

    if(!Array.isArray(lectures) || typeof student_id !== 'string') {
        throw new Error('Lecture must be an array, and student_id must be a string');
    }

    let lecturesAttended = 0;
    let lecturesTheStudentIsEnroledIn = 0;
    let lecturesStatistics = [];


    lectures.forEach(lecture => {
        if(lecture?.students_enroled?.includes(student_id)) {
            lecturesTheStudentIsEnroledIn++;

            let currentLectureReturnObject = {
                lecture_id: lecture._id,
                lecture_name: lecture.name,
                lectureStartTimestamp: lecture.start,
                lectureEndTimestamp: lecture.end,
                attended: false
            };

            if(lecture?.students_checked_in?.includes(student_id)) {
                lecturesAttended++;
                currentLectureReturnObject.attended = true; 
            }

            lecturesStatistics.push(currentLectureReturnObject);
        }
    });

    if(lecturesTheStudentIsEnroledIn === 0) {
        throw new Error('The student_id provided has not been enroled in any of the lectures provided');
    }

    attendanceObject = {
        student_id: student_id,
        lecturesAttended: lecturesAttended,
        lecturesTheStudentIsEnroledIn: lecturesTheStudentIsEnroledIn,
        attendancePercentage: calculatePercentage(lecturesAttended, lecturesTheStudentIsEnroledIn),
        lectures: lecturesStatistics
    };

   return attendanceObject;

}

exports.calculateLectureStatistics = function (lecture_array) {

    if(!Array.isArray(lecture_array)) {
        throw new Error("single_subject_lectures must be an array of lectures");
    }

    let maximumStudentAttendance = 0; 
    let studentAttendance = 0; 
    let lectureAttendancePercentages = [];
    let firstLectureInPeriodTimestamp = Number.MAX_SAFE_INTEGER;
    let lastLectureInPeriodTimestamp = Number.MIN_SAFE_INTEGER; 

    lecture_array.forEach(lecture => {

        let numberOfStudentsInThisLecture = Array.isArray(lecture?.students_enroled) ? lecture.students_enroled.length : 0;
        let numberOfStudentsThatAttended = Array.isArray(lecture?.students_checked_in) ? lecture.students_checked_in.length : 0;

        maximumStudentAttendance += numberOfStudentsInThisLecture; 
        studentAttendance += numberOfStudentsThatAttended;

        let attendancePercentageObject = {
            lectureId: lecture?._id ? lecture._id : "Not available",
            lectureName: lecture.name,
            studentsEnroled: numberOfStudentsInThisLecture,
            attendedStudents: numberOfStudentsThatAttended,
            attendacePercentage: calculatePercentage(numberOfStudentsThatAttended, numberOfStudentsInThisLecture),
            lectureStartTimestamp: lecture?.start ? lecture.start : "Not available",
            lectureEndTimestamp: lecture?.end ? lecture.end : "Not available",
        };

        if(attendancePercentageObject.lectureStartTimestamp < firstLectureInPeriodTimestamp) {
            firstLectureInPeriodTimestamp = attendancePercentageObject.lectureStartTimestamp;
        }

        if(attendancePercentageObject.lectureEndTimestamp > lastLectureInPeriodTimestamp ) {
            lastLectureInPeriodTimestamp = attendancePercentageObject.lectureEndTimestamp;
        }

        lectureAttendancePercentages.push(attendancePercentageObject);
    })

    attendanceObject = {
        numberOfLectures: lecture_array.length,
        period: {
            start: firstLectureInPeriodTimestamp,
            end: lastLectureInPeriodTimestamp
        },
        overallAttendancePercentage: calculatePercentage(studentAttendance, maximumStudentAttendance),
        lectureAttendancePercentages: lectureAttendancePercentages,
    }

    return attendanceObject;

}

function calculatePercentage(fraction, total) {
    if(!total) {
        return 0;
    }

    return (fraction / total) * 100;
}



// async function gogo() {
//     try {
//         //let lectures = await findLectureWithTeacherAndStudent('61b1ebba583b9cffc447c61f', '61b1ebb8583b9cffc447c5ed');
//         let single_sub_lectures = await findLectureWithTeacherAndLectureName('61b1ebba583b9cffc447c61f', 'Math');

//         //exports.calculateStudentAttendance(lectures, '61b1ebb8583b9cffc447c5ed');
//         let test = exports.calculateClassAttendanceForSubject(single_sub_lectures);
//         console.log(test);
//     } catch (err) {
//         console.log(err);
//         process.exit(0);
//     }
// }

// gogo();