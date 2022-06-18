const express = require('express');
const mealDistributionController = require('../Controller/mealDistributionController');
const accessValidation = require('../Middleware/authMiddleware');
const verifyRoles = require('../Middleware/verifyRoles');
const {Admin, MealManager, User} = require('../Utility/roleList');

const route = express.Router();

//save the food Distribution Form
route.post('/foodDistribution', accessValidation, verifyRoles(Admin, MealManager), mealDistributionController.foodDistributionForm);

//Display monthly bill
route.get('/getMemo/:id', mealDistributionController.getMemo);

module.exports = route;