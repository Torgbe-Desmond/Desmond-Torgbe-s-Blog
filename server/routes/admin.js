const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/protectRoutes');
const Unauthorized = require('../Errors/Unauthorized');
const { StatusCodes } = require('http-status-codes');
const Message = require('../models/messages');
const adminLayout = '../views/layouts/admin';
require('dotenv').config();



router.get('/admin', async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
      
    }
    res.render('admin/index', { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
        const user = await User.findOne({ username });
    if (!user && !( await bcrypt.compare(password, user.password))) {
      console.log('something')
      throw new Unauthorized('Invalid credentials');
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');

  } catch (error) {
    throw error;
  }
});



router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Dashboard',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }
    const data = await Post.find({});
    res.render('admin/dashboard', {
      locals,
      data,
      layout: adminLayout,
    });
  } catch (error) {
    throw error;
  }

});


router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Post',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }
    const data = await Post.find({});
    res.render('admin/add-post', {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    throw error;
  }

});


router.post('/add-post', authMiddleware, async (req, res) => {
     const session = await mongoose.startSession();
     session.startTransaction();
    try {
      const newPost = {
        title: req.body.title,
        body: req.body.body
      }
      await Post.create(newPost);
      await session.commitTransaction();
      res.redirect('/dashboard');
    } catch (error) {
      await session.abortTransaction();
      throw error
    } finally {
      session.endSession();
    }

});



router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      description: "Free Blog User Management System",
    };
    const data = await Post.findOne({ _id: req.params.id });
    res.render('admin/edit-post', {
      locals,
      data,
      layout: adminLayout,
    })
  } catch (error) {
    throw error;
  }

});


router.post('/contact-me', async(req,res)=>{
  const session = await mongoose.startSession();
  session.startTransaction();
  const messageObject = {
    email:req.body.email,
    message:req.body.message
  }
  console.log(req.body);
  try {
   await Message.create([messageObject],{session});
   await session.commitTransaction();
   res.status(StatusCodes.CREATED).json();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
})



router.get('/messages', async (req, res) => {
  try {
      const messages = await Message.find({}); 
      res.render('messages', { 
          messages,          
          currentRoute: '/messages'
      });
  } catch (error) {
      throw error;
  }
});


router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now()
    },{session});
    await session.commitTransaction();
    res.redirect(`/edit-post/${req.params.id}`);
  } catch (error) {
    throw error;
  }

});

router.post('/register', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create([{ username, password:hashedPassword }],{session});
      res.status(StatusCodes.CREATED).json({ message: 'User Created', user });
    } catch (error) {
       await session.abortTransaction();
       throw error;
    } finally {
      session.endSession();
    }
});


router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Post.deleteOne( { _id: req.params.id } );
    await session.commitTransaction();
    res.redirect('/dashboard');
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }

});


router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});


module.exports = router;