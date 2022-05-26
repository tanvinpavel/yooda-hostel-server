const express = require('express');
const mealDistributionController = require('../Controller/mealDistributionController');
const accessValidation = require('../Middleware/authMiddleware');

const route = express.Router();

//save the food Distribution Form
route.post('/foodDistribution', accessValidation, mealDistributionController.foodDistributionForm);

route.get('/getMemo/:id', mealDistributionController.getMemo);

module.exports = route;