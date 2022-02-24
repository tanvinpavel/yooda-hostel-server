const express = require('express');
const mealDistributionController = require('../Controller/mealDistributionController');

const route = express.Router();

route.get('/getMemo/:id', mealDistributionController.getMemo);

module.exports = route;