const config = require("../config");
const { MongoClient, ObjectId } = require("mongodb");
const faker = require("faker");

// Connection URL
const url = "mongodb://" + config.mongodb.host + ":" + config.mongodb.port;
const client = new MongoClient(url);
const dbName = config.mongodb.fakecphdbname;

exports.insertLecture = async function (lecture) {

    var inserted;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("lectures");
        inserted = await collection.insertOne(lecture);
    } catch (error) {
        console.log(error);
    } 
        
    return inserted;

}

exports.findLectureById = async function (id) {

    var lecture;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("lectures");
        var o_id = ObjectId(id);
        lecture = await collection.findOne({"_id": o_id});
    } catch (error) {
        console.log(error);
    } 
        
    return lecture;

}

exports.applyCodeToLecture = async function (lecture_id, generatedCode) {

    var updateResult;

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("lectures");
    const o_id = ObjectId(lecture_id);
    try {
        updateResult = await collection.updateOne(
           { "_id" : o_id },
           { $set: { "attendance_code" : generatedCode } }
        );
     } catch (e) {
        print(e);
     }

     return updateResult;
}

exports.registerStudentAttendance = async function (student_id, lecture_id) {

    var updateResult;

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("lectures");
    const o_id = ObjectId(lecture_id);

    try {
        updateResult = await collection.updateOne(
           { "_id" : o_id },
           { $addToSet: { students_checked_in : student_id } }
        );
     } catch (e) {
        print(e);
     }

     return updateResult;
}

exports.getLectureCode = async function (lecture_id) {
    var attendance_code_result;

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("lectures");
    const o_id = ObjectId(lecture_id);

    try {
        attendance_code_result = collection.findOne(
           { '_id' : o_id },
           { projection: {attendance_code: 1, _id: 0} }
        );
     } catch (e) {
        console.log(e);
     }

     return attendance_code_result;
}

exports.findLectureWithTeacherAndStudent = async function (teacher_id, student_id) {
    if(!typeof teacher_id === 'string' || !typeof student_id === 'string') {
        throw new Error('Invalid input, teacher_id and student_id must be strings');
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("lectures");

    let result = collection.find({teacher_docref: teacher_id, students_enroled: student_id});

    if(!await result.hasNext()) {
        throw new Error('No lectures contains both the teacher and student id provided');
    }

    let lectures = [];
    while(await result.hasNext()) {
        lectures.push(await result.next())
    }

    return lectures;

}

exports.findLectureWithTeacherAndLectureName = async function (teacher_id, lecture_name) {
    if(!typeof teacher_id === 'string' || !typeof lecture_name === 'string') {
        throw new Error('Invalid input, teacher_id and student_id must be strings');
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("lectures");

    let result = collection.find({teacher_docref: teacher_id, name: lecture_name});

    if(!await result.hasNext()) {
        throw new Error('No lectures contains both the teacher and student id provided');
    }

    let lectures = [];
    while(await result.hasNext()) {
        lectures.push(await result.next())
    }

    return lectures;

}

exports.findLecturesWhereStudentHasAttended = async function(teacher_id, student_id) {

    let lectures = [];

    try {
        lectures = await exports.findLectureWithTeacherAndStudent(teacher_id, student_id);
    } catch (error) {
        throw new Error(error.message);
    }

    let lecturesTheStudentHasAttended = [];

    lectures.forEach(lecture => {
        if(lecture?.students_checked_in?.includes(student_id)) {
            lecturesTheStudentHasAttended.push(lecture);
        }
    })

    return lecturesTheStudentHasAttended;

}

exports.findLecturesWithTeacherAndStudentInInterval = async function(teacher_id, student_id, start, end) {

    if(!typeof teacher_id === 'string' || !typeof student_id === 'string' || isNaN(start?.getTime()) || isNaN(end?.getTime())) {
        throw new Error('Invalid input, teacher_id and student_id must be strings, start and end must be date objects');
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("lectures");

    let result = collection.find({teacher_docref: teacher_id, students_enroled: student_id, start: {$gte: start}, end: {$lte: end}});

    if(!await result.hasNext()) {
        throw new Error('No lectures contains both the teacher and student id provided within the given period');
    }

    let lectures = [];
    while(await result.hasNext()) {
        lectures.push(await result.next())
    }

    return lectures;

}

exports.findLecturesWithTeacher = async function(teacher_id) {

    if(!typeof teacher_id === 'string') {
        throw new Error('Invalid input, teacher_id must be a string');
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("lectures");

    let result = collection.find({teacher_docref: teacher_id});

    if(!await result.hasNext()) {
        throw new Error('No lectures contains the teacher_id provided');
    }

    let lectures = [];
    while(await result.hasNext()) {
        lectures.push(await result.next())
    }

    return lectures;

}

exports.findLecturesWithTeacherInInterval = async function(teacher_id, start, end) {

    if(!typeof teacher_id === 'string' || isNaN(start?.getTime()) || isNaN(end?.getTime())) {
        throw new Error('Invalid input, teacher_id must be a string, start and end must be date objects');
    }

    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("lectures");

    let result = collection.find({teacher_docref: teacher_id, start: {$gte: start}, end: {$lte: end}});

    if(!await result.hasNext()) {
        throw new Error('No lectures contains the teacher_id provided within the given period');
    }

    let lectures = [];
    while(await result.hasNext()) {
        lectures.push(await result.next())
    }

    return lectures;

}




