const express = require('express');
const mealController = require('../Controller/mealController');
const accessValidation = require('../Middleware/authMiddleware');
const verifyRoles = require('../Middleware/verifyRoles');
const {Admin, MealManager, User} = require('../Utility/roleList');

const route = express.Router();

//                      <== PUBLIC Route ==>

//get all meal
route.get('/', mealController.loadAllMealData);

//                      <== PRIVATE Route ==>

//load single data by id
route.get('/:id', accessValidation, verifyRoles(Admin, MealManager), mealController.loadMealDataById);

//add meal
route.post('/addMeal', accessValidation,  verifyRoles(Admin, MealManager), mealController.addNewMeal);

//update by id
route.put('/update/:id', accessValidation, verifyRoles(Admin, MealManager), mealController.updateMealById);

//delete by id
route.delete('/delete/:id', accessValidation, verifyRoles(Admin, MealManager), mealController.deleteMealById);

//bulk action
route.delete('/deleteMany', accessValidation, verifyRoles(Admin, MealManager), mealController.deleteMany);


module.exports = route;