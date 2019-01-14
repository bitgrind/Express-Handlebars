const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

//Load Thead model
require('../models/Thread');
const Thread = mongoose.model('thread');


router.get('/', ensureAuthenticated, (req, res) => {
  Thread.find({user: req.user.id})
    .sort({date:'desc'})
    .then( threads => {
      res.render('threads/index', {
        threads: threads
      });
    });
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('threads/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Thread.findOne({
    _id: req.params.id
  })
  .then( thread => {
    if(thread.user !== req.user.id) {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/theads');
    } else {
      res.render('threads/edit', {
        thread: thread
      });
    }
  });
});

//Process form
router.post('/', (req, res) => {
  console.log('Post Thread');
  console.log(req.body);
  console.log(req.user);
  let errors = [];

  if(!req.body.title) {
    errors.push({text:'Please Add Title'});
  }
  if(!req.body.details) {
    errors.push({text:'Please Add Details'});
  }
  console.log(errors);
  if(errors.length > 0) {
    res.render('/treads/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newThread = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Thread(newThread)
      .save()
      .then(thread => {
        req.flash('success_msg', 'Thread Added Successful!');
        res.redirect('/threads');
      })
  }
});

//Edit form
router.put('/:id', ensureAuthenticated, (req, res) => {
  Thread.findOne({
    _id: req.params.id
  })
  .then( thread => {
    thread.title = req.body.title;
    thread.details = req.body.details;
    thread.save()
      .then( thread => {
        req.flash('success_msg', 'Thread Edited Successful!');
        res.redirect('/threads')
      })
  });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Thread.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Delete Successful!');
      res.redirect('/threads');
    });
});


module.exports = router;