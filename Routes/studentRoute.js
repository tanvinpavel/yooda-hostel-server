const express = require("express")
const studentController = require('../Controller/studentController');
const accessValidation = require('../Middleware/authMiddleware');

const route = express.Router();


//                                <== PUBLIC Route ==>

//load all student data
route.get('/', studentController.loadAllStudentData);

//search student by (name & roll) 
route.post('/searchStudent', studentController.searchStudent);

//load student data by id
route.get('/:id', studentController.loadStudentDataById);
//                                <== PRIVATE Route ==>

//add new student
route.post('/addStudent', accessValidation, studentController.addNewStudent);


//update multiple status(bulk action)
route.put('/updateStatus/action', accessValidation, studentController.updateMultipleStatus);

//update student info by id
route.put('/updateInfo/:id', accessValidation, studentController.updateStudentInfoByID);

//delete student by id
route.delete('/deleteStudent/:id', accessValidation, studentController.deleteStudentById);

//delete multiple student
route.post('/deleteMultipleStudent', accessValidation, studentController.deleteMultipleStudent);

module.exports = route;