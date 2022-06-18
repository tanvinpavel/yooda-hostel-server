const express = require("express");
const authController = require("../Controller/authController");
const accessValidation = require("../Middleware/authMiddleware");

const app = express;

const authRoute = app.Router();

authRoute.post('/signup', authController.signup);
authRoute.post('/login', authController.login);
authRoute.delete('/logout', authController.logout);
authRoute.get('/getAccessToken', authController.newAccessToken);

module.exports = authRoute;