const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const ObjectId = Schema.ObjectId;
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  
  lastName: {
    type: String,
    required: true,
  },
  
  username: {
    type: String,
    required: true,
    unique: true,
  },
  
  email: {
    type: String,
    required: true,
    unique: true,
  },
  
  password: {
    type: String,
    required: true,
  },

  confirmPassword: {
    type: String,
    required: true
  }
},

{timestamps : true});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  userSchema.methods.validPassword = async function (password, userPassword) {
    const comparePassword = await bcrypt.compare(password, userPassword);
    return comparePassword;
  };
const User = mongoose.model('User', userSchema);

module.exports = User;