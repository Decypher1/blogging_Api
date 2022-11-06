const blogModel = require('../models/blogModel');
const UserModel = require('../models/usersModel');
const Jwt = require('jsonwebtoken');
const { getToken, decryptToken} = require('../utils/authToken')
require('dotenv').config();


const getAllBlogs = async (req, res, next) => {
    try {
        let query = blogModel.find({state: { $ne: 'draft' }})
        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit'];
        excludedFields.forEach(el => delete queryObj[el]);

        query = query.find(queryObj);

        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join('');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-readCount -readingTime -timestamp') //  sorting
        }
        

        //PAGINATION
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        if (req.query.page) {
            const collectionCount = await blogModel.countDocuments();
            if(skip >= collectionCount) return next(res.status(404).send('This page does not exist'));
        }
    
        query = query.skip(skip).limit(limit);
    
        query = query.select('-__v').populate('author', {firstName: 1, lastName: 1});

        // If no details are returned 
        if (query.length === 0) return next(res.status(404).send('No result returned'));

        const blogs = await query;

        res.status(200).json({
            status: 'success',
            length: blogs.length,
            data: {
                blogs
            }
        });
    } catch (error) {
        next(error);
    }
};


//Create a new blog
const createBlog = async (req, res, next) => {
    const { title, description, state, tags, body } = req.body;
    if (!title || !description || !body || !tags) {
        return res.status(400).send({ message: 'Required fields are empty!' });
    }
    try {
        // Extract author/user id from the token received
        const author_id = (await decryptToken(req.headers.authorization)).id;

        const author = await UserModel.findById(author_id)

        const blog = new blogModel({
            title,
            description,
            state,
            tags,
            body,
            author: author._id
        })
        const savedBlog = await blog.save();

        author.article = author.article.concat(savedBlog._id);
        await author.save();

        res.status(201).json({
            status: 'success',
            data: {
                user: savedBlog
            }
        })
    } catch (err) {
        next(err)
    }
};

//Get a blog by id
const getBlog = async (req, res, next) => {
    try {
        const blogID = req.params.id;

        let query = blogModel.findOneAndUpdate({state: { $ne: 'draft' }, _id: blogID}, {$inc: {readCount: 1}}, {new: true})
    
        query = query.select('-__v').populate('author', {firstName: 1, lastName: 1});

        const blog = await query;

        // If no details returned in the query, the below error is encountered
        if (!blog) return next(new Error('No result returned', 404));

        res.status(200).json({
            status: 'success',
            data: {
                blog
            }
        })
    } catch (err) {
        next(err)
    }
};



const getUserBlogs = async (req, res, next) => {
    try {
        const author = req.user['_id'].toString();

        const queryObj = {...req.query};
        const excludedFields = ['page', 'sort', 'limit'];
        excludedFields.forEach(el => delete queryObj[el]);

        let query = blogModel.find({author});

        query = query.find(queryObj);
    
        if(req.query.sort) {
            const sortBy = req.query.sort.split(',').join('');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-timestamp') // default sorting
        }

        // For pagination
        const page = req.query.page || 1;
        const limit = req.query.limit || 20;
        const skip = (page - 1) * limit;

        if (req.query.page) {
            const collectionCount = await query.countDocuments();
            if(skip >= collectionCount) return next(new Error('This page does not exist', 404));
        }

        query = query.skip(skip).limit(limit);

        query = query.select('-__v').populate('author', {firstName: 1, lastName: 1});

        // If no details returned in the query
        if (!query) return next(new Error('No result returned', 404));

        const blogs = await query;

        res.status(200).json({
            status: 'success',
            length: blogs.length,
            data: {
                blogs
            }
        });
    } catch (error) {
        next(error)
    }

};

//update blog
const updateBlog = async (req, res, next) => {
    const userID = req.user['_id'].toString();
    const blogID = req.params.id;
    const blogState = req.body.state;
    const reqBody = req.body;

    const excludedFields = ['readCount', 'author', '_id'];
    excludedFields.forEach(el => delete reqBody[el]);
    
    const author = await blogModel.findById(blogID);

    if (!author) return next(new Error('Invalid Blog ID provided', 400));
    
    if (userID !== author.author.toString()) {
        return next(new Error('You are not authorized to update this blog', 401));
    }

    if(blogState){
        if (blogState !== "draft" && blogState !== "published") {
            return next(new Error(`Blog state can either be 'published' or 'draft'`, 401));
        }
    }

    const updatedArticle = await blogModel.findByIdAndUpdate(blogID, reqBody, {new: true});

    res.status(200).json({
        status: 'success',
        data: {
            updatedArticle
        }
    });
};



//Delete blog
const deleteBlog = async (req, res, next) => {
    try {
        const userID = req.user['_id'].toString();
        const blogID = req.params.id;

        const author = await blogModel.findById(blogID);
        if(!author) return next(new Error('Blog  not Found!', 404));

        if (userID !== author.author.toString()) {
            return next(new Error('Blog can only be deleted by owner. Please log in', 401));
        }

        await blogModel.deleteOne({_id: blogID});

        res.status(200).json({
            status: 'success',
            data: {
                blogID
            }
        });

    } catch(error) {
        next(error)
    }
    
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlog,
    deleteBlog,
    updateBlog,
    getUserBlogs,
};