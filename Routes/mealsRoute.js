const express = require('express');
const mealController = require('../Controller/mealController');

const route = express.Router();

//get all meal
route.get('/', mealController.loadAllMealData);

//load single data by id
route.get('/:id', mealController.loadMealDataById);

//add meal
route.post('/addMeal', mealController.addNewMeal);

//update by id
route.put('/update/:id', mealController.updateMealById);

//delete by id
route.delete('/delete/:id', mealController.deleteMealById);

//bulk action
route.delete('/deleteMany', mealController.deleteMany);


module.exports = route;