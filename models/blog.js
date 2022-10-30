const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({

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
  
  tags: [ String ],
  
  state: {
    type: String,
    default: 'draft', enum: ['draft', 'published']
  },
  
  readCount: {
    type: Number,
    default: 0
  },
  
  readingTime: {
    type: Number
  }
  
})

module.exports = mongoose.model('blog', blogSchema)