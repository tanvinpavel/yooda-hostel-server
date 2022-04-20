const express = require('express');
const mealController = require('../Controller/mealController');
const accessValidation = require('../Middleware/authMiddleware');

const route = express.Router();

//                      <== PUBLIC Route ==>

//get all meal
route.get('/', mealController.loadAllMealData);

//                      <== PRIVATE Route ==>

//load single data by id
route.get('/:id', accessValidation, mealController.loadMealDataById);

//add meal
route.post('/addMeal', accessValidation, mealController.addNewMeal);

//update by id
route.put('/update/:id', accessValidation, mealController.updateMealById);

//delete by id
route.delete('/delete/:id', accessValidation, mealController.deleteMealById);

//bulk action
route.delete('/deleteMany', accessValidation, mealController.deleteMany);


module.exports = route;