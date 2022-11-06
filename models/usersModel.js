const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const validPassword = require('../utils/validatePassword')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name']
  },
  
  lastName: {
    type: String,
    required: [true, 'Please provide last name']
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email address']
  },
  
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be 6 and above characters in length'],
    select: false
  },

  article: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'blog',
    }
  ]
},

{timestamps : true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
  
  userSchema.methods.validPassword = async function (password, userPassword) {
    const comparePassword = await bcrypt.compare(password, userPassword);
    return comparePassword;
  };
const User = mongoose.model('User', userSchema);

module.exports = User;