import express from 'express';
import models from '../models';
var router = express.Router();

router.get('/', (req, res) => {
  res.render('admin/dashboard', {
    name: 'cc'
  });
});

router.get('/post', (req, res) => {
  res.render('admin/add-post', {
  });
});

router.post('/post', (req, res) => {
  let new_post = new models.PostModel({
    title: req.body.title,
    content: req.body.content,
    tags: req.body.tags
  });
  new_post.save((err, post) => {
    if (err) {
      console.log(err);
    }
    res.render('admin/add-post', {
    });
  });
});

module.exports = router;
