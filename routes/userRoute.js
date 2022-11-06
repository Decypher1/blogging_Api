const express = require('express');
const accountRoute = express.Router();
const {Signup, login, logout} = require('../controllers/authController');

accountRoute.post('/signup', Signup);
accountRoute.post('/login', login);
accountRoute.get('/logout', logout);

module.exports = accountRoute;