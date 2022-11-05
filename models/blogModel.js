const mongoose = require('mongoose')
const User = require("./usersModel")

const blogSchema = new mongoose.Schema(
  {
    
    title: {
    type: String,
    required: true,
    unique: true,
  },
  
  description: String,
  
  author: {
    type: String,
    required: true
  },
  
  tags: {
    type: [ String ]
  },
  
  state: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  
  readCount: {
    type: Number,
    default: 0
  },
  
  readingTime: {
    type: Number
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },

  body: {
    type: String,
    required: true
  }
},
  
{ timestamps: true }
);


const blog = mongoose.model('blog', blogSchema);

module.exports = blog;