const jwt = require('jsonwebtoken');
const UserModel = require('../models/usersModel');
const validatePassword = require('../utils/validatePassword')
const bcrypt = require('bcrypt')
require('dotenv').config();

//SIGNUP
const Signup = async (req, res, next) => {
    const { firstName, lastName, username, email, password, confirmPassword } = req.body;
       
    //checking to make sure all fields are filled 
    if (!firstName ||!lastName ||!username||!email ||!password ||!confirmPassword) {
        return res.status(400).send({ message: 'Please fill all the fields!' });
    }
    
    //Confirming passwords are the same
    if (password !== confirmPassword) {
        return res.status(400).send({ message: 'Password did not match!' });
    }


    //   Saving to the database
    try {
        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            username,
            password
        });
        return res.status(200).send({ message: 'User Account created successfully' });
    } catch (error) {
        next(error);
    }
};

//LOGIN Controller
const login = async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).send({ message: 'Please fill the required fields' });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user){
            return res.status(401).send({ message: 'This email is not found!' });
        }
        
        const validPassword = await user.validatePassword(password);

        if (!validPassword)
            return res.status(401).send({ message: 'Password is not correct!' });

        const payload = {
            id: user._id,
            username: user.username,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.EXPIRE || '1hr',
        });
        
        res.cookie('accessToken', token, {
            httpOnly: true,
        }).send({
            message: token,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
        });
    } catch (error) {
        next(error);
    }
};


//LOGOUT CONTROLLER
const logout = async (req, res) => {
    res.cookie('accessToken', '', { maxAge: 1 });
    res.send('Logged out successfully!');
};

module.exports  = { Signup, login, logout };
