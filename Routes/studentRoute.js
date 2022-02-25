const express = require("express")
const studentController = require('../Controller/studentController');

const route = express.Router();

//routes
//load all student data
route.get('/', studentController.loadAllStudentData);

//load student data by id
route.get('/:id', studentController.loadStudentDataById);

//add new student
route.post('/addStudent', studentController.addNewStudent);

//add new student
route.post('/searchStudent', studentController.searchStudent);

//update multiple status(bulk action)
route.put('/updateStatus/action', studentController.updateMultipleStatus);

//update student info by id
route.put('/updateInfo/:id', studentController.updateStudentInfoByID);

//delete student by id
route.delete('/deleteStudent/:id', studentController.deleteStudentById);

//save the food Distribution Form
route.post('/foodDistribution', studentController.foodDistributionForm);

module.exports = route;