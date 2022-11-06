const express = require('express');
const {
    createBlog,
    getAllBlogs,
    getBlog,
    deleteBlog,
    updateBlog,
    getUserBlogs
} = require('../controllers/blogController');

const  authenticateToken  = require('../utils/authToken');
const {protectCreateBlog} = require('../controllers/authController');

const router = express.Router();

router.route('/').get(getAllBlogs);
router.post('/create', protectCreateBlog, createBlog)
router.route('/all').get(protectCreateBlog, getUserBlogs);
router.get('/:id', protectCreateBlog, updateBlog);
router.put('/:id', protectCreateBlog, updateBlog);
router.delete('/:id', protectCreateBlog, deleteBlog);



module.exports = router;