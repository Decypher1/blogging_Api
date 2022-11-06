const express = require('express');
const {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    deleteBlog,
    updateBlog,
    userBlogs,
} = require('../controllers/blogController');

const  authenticateToken  = require('../middleware/authToken');

const blogRoute = express.Router();

blogRoute.route('/blogs').post(authenticateToken, createBlog).get(getAllBlogs);

blogRoute.route('/userblog').get(authenticateToken, userBlogs);

blogRoute
    .route('/:id')
    .get(getSingleBlog)
    .put(authenticateToken, updateBlog)
    .delete(authenticateToken, deleteBlog);

module.exports = blogRoute;