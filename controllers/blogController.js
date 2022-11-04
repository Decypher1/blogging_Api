const blogModel = require('../models/blogModel');
const UserModel = require('../models/usersModel');
const Jwt = require('jsonwebtoken');
require('dotenv').config();


const getAllBlogs = async (req, res, next) => {
    try {
        //PAGINATION
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 20;

        // SEARCHING by title, author and tags
        let search = {};
        if (req.query.author) {
            search = { author: req.query.author };
        } else if (req.query.title) {
            search = { title: req.query.title };
        } else if (req.query.tags) {
            search = { tags: req.query.tag };
        }

        // GET blogs from the database
        const blogs = await blogModel
            .find(search)
            .where({ state: 'published' })
            .sort({ readingTime: 1, readCount: -1, timestamps: -1 })
            .skip(page * limit)
            .limit(limit);

        const count = await blogModel.countDocuments();

        if (blogs) {
            res.status(200).send({
                message: blogs,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
            });
        } else {
            res.status(404).send({ message: 'No Blog Found' });
        }
    } catch (error) {
        next(error);
    }
};

//GET SINGLE BLOG
const getSingleBlog = async (req, res, next) => {
    try {
        const singleBlog = await blogModel
            .findById(req.params.id)
            .where({ state: 'published' })
            .populate('user', { firstName: 1, lastName: 1, email: 1 });

        if (!singleBlog)
            return res.status(404).send({ message: 'Blog NOT FOUND' });

        singleBlog.readCount++;
        const blog = await singleBlog.save();

        res.status(200).send({ blog: blog });
    } catch (error) {
        next(error);
    }
};


//Creating a NEW blog
const createBlog = async (req, res, next) => {
    const { title, description, body, tags } = req.body;

    if (!title || !description || !body || !tags) {
        return res.status(400).send({ message: 'Required fields are empty!' });
    }
    try {
        const user = await UserModel.findById(req.user._id);

        const notes = new blogModel({
            title,
            description,
            author: `${user.firstName} ${user.lastName}`,
            body,
            tags,
            readingTime: readingTime(body),
            user: user._id,
        });

        const savedNotes = await notes.save();

        
        user.article = user.article.concat(savedNotes._id);
        await user.save();

        res.status(201).send({ message: 'Blog created Successfully!' });
    } catch (error) {
        next(error);
    }
};

//UPDATING BLOG BY USER
const updateBlog = async (req, res, next) => {
    const { state, title, description, body, tags } = req.body;
    try {
        const user = req.user;

        const blog = await blogModel.findById(req.params.id);

        if (user.id === blog.user._id.toString()) {
            const updatedBlog = await blogModel.findByIdAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        state,
                        title,
                        description,
                        body,
                        tags,
                    },
                },
                {
                    new: true,
                }
            );

            res.status(200).send(updatedBlog);
        } else {
            res.status(401).send({ message: 'Not Authorized!' });
        }
    } catch (error) {
        next(error);
    }
};


//DELETE BLOG BY USER
const deleteBlog = async (req, res, next) => {
    try {
        const user = req.user;

        const blog = await blogModel.findById(req.params.id);

        if (user.id === blog.user._id.toString()) {
            await blogModel.findByIdAndDelete(req.params.id);
            return res.status(201).send({ message: 'Blog deleted successfully' });
        } else {
            res.status(401).send({ message: 'Not Authorized!' });
        }
    } catch (error) {
        next(error);
    }
};



const userBlogs = async (req, res, next) => {
    try {
        const user = req.user;

        // implementing pagination
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 20;

        const User = await UserModel.findById(user.id)
            .populate('article')
            .skip(page * limit)
            .limit(limit);
        const count = await UserModel.countDocuments();

        res.status(200).send({
            message: 'Your blog post',
            blogs: User.article,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        next(error);
    }
};

// Math for time to read a book
const readingTime = (body) => {
    const wpm = 300;
    const text = body.trim().split(/\s+/).length;
    const time = Math.ceil(text / wpm);
    return `${time} mins`;
};

module.exports = {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    deleteBlog,
    updateBlog,
    userBlogs,
};