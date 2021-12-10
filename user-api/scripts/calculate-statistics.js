const { findLectureWithTeacherAndStudent, findLectureWithTeacherAndLectureName } = require('../database/lecture-mongo_db');

exports.calculateStudentAttendance = function (lectures, student_id) {

    if(!Array.isArray(lectures) || typeof student_id !== 'string') {
        throw new Error('Lecture must be an array, and student_id must be a string');
    }

    let lecturesAttended = 0;
    let lecturesTheStudentIsEnroledIn = 0;


    lectures.forEach(lecture => {
        if(lecture?.students_enroled?.includes(student_id)) {
            lecturesTheStudentIsEnroledIn++;

            if(lecture?.students_checked_in?.includes(student_id)) {
                lecturesAttended++
            }
        }
    });

    if(lecturesTheStudentIsEnroledIn === 0) {
        throw new Error('The student_id provided has not been enroled in any of the lectures provided');
    }

    attendanceObject = {
        student_id: student_id,
        lecturesAttended: lecturesAttended,
        lecturesTheStudentIsEnroledIn: lecturesTheStudentIsEnroledIn,
        attendancePercentage: calculatePercentage(lecturesAttended, lecturesTheStudentIsEnroledIn)
    };

    console.log(attendanceObject);

   return attendanceObject;

}

exports.calculateClassAttendanceForSubject = function (single_subject_lectures) {

    if(!Array.isArray(single_subject_lectures)) {
        throw new Error("single_subject_lectures must be an array of lectures");
    }

    let maximumStudentAttendance = 0; 
    let studentAttendance = 0; 
    let lectureAttendancePercentages = [];

    single_subject_lectures.forEach(lecture => {

        let numberOfStudentsInThisLecture = Array.isArray(lecture?.students_enroled) ? lecture.students_enroled.length : 0;
        let numberOfStudentsThatAttended = Array.isArray(lecture?.students_checked_in) ? lecture.students_checked_in.length : 0;

        maximumStudentAttendance += numberOfStudentsInThisLecture; 
        studentAttendance += numberOfStudentsThatAttended;

        let attendancePercentageObject = {
            id: lecture?._id ? lecture._id : "Not available",
            studentsEnroled: numberOfStudentsInThisLecture,
            attendedStudents: numberOfStudentsThatAttended,
            attendacePercentage: calculatePercentage(numberOfStudentsThatAttended, numberOfStudentsInThisLecture)
        };

        lectureAttendancePercentages.push(attendancePercentageObject);
    })

    attendanceObject = {
        numberOfLectures: single_subject_lectures.length,
        lectureAttendancePercentages: lectureAttendancePercentages,
        overallAttendancePercentage: calculatePercentage(studentAttendance, maximumStudentAttendance)
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