const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Load Thead model
require('../models/Thread');
const Thread = mongoose.model('thread');


router.get('/', (req, res) => {
  Thread.find({})
    .sort({date:'desc'})
    .then( threads => {
      res.render('threads/index', {
        threads: threads
      });
    });
});

router.get('/add', (req, res) => {
  res.render('threads/add');
});

router.get('/edit/:id', (req, res) => {
  Thread.findOne({
    _id: req.params.id
  })
  .then( thread => {
    res.render('threads/edit', {
      thread: thread
    });
  });
});

//Process form
router.post('/', (req, res) => {
  console.log(req.body);
  let errors = [];

  if(!req.body.title) {
    errors.push({text:'Please Add Title'});
  }
  if(!req.body.details) {
    errors.push({text:'Please Add Details'});
  }
  if(errors.length > 0) {
    res.render('/treads/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,

    }
    new Thread(newUser)
      .save()
      .then(thread => {
        req.flash('success_msg', 'Thread Added Successful!');
        res.redirect('/threads');
      })
  }
});

//Edit form
router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
  Thread.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Delete Successful!');
      res.redirect('/threads');
    });
});


module.exports = router;