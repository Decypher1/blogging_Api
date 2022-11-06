const jwt = require('jsonwebtoken');
const UserModel = require('../models/usersModel');
const validatePassword = require('../utils/validatePassword')
const {getToken, decryptToken, ensureCorrectUser} = require('../utils/authToken')
const bcrypt = require('bcrypt')
require('dotenv').config();

//SIGNUP
const Signup = async (req, res, next) => {
    const { firstName, lastName, username, email, password } = req.body;
       
    //checking to make sure all fields are filled 
    if (!firstName ||!lastName ||!username ||!email ||!password) {
        return res.status(400).send({ message: 'Please fill all the fields!' });
    }
    
    //   Saving to the database
    try {
        const user = UserModel.create({
            firstName,
            lastName,
            username,
            email,
            password
        });
        const newUser = await user.save()
        const token = await getToken(newUser._id);
        return res.status(201).json(
            {
                status: 'Success',
                author_id: user._id,
                token,
                data: {
                    user: newUser
                }
              });
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
        const user = await UserModel.findOne({ email }).select('+password');

        if (!user || !(await user.validatePassword(password, user.password))) {
            return next(res.status(401).send({ message: 'This email or password is not found!' }));
        }
        

        const token = getToken(user._id);
        res.status(200).json({
            status: 'success',
            author_id: user._id,
            token,
        });
        
    } catch (error) {
        next(error);
    }
};


const protectCreateBlog = async (req, res, next) => {
    const requestHeader = req.headers.authorization;

    // Verify the token received and confirm the user exist
    const decrypt = await decryptToken(requestHeader);
    const loginUser = await UserModel.findById(decrypt.id);
    if (!loginUser) {
        return next(res.status(401).send({message: 'The user with the received token does not exist'}));
    }
    req.user = loginUser;
    next();
};

module.exports  = { Signup, login, protectCreateBlog };
