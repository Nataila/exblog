import express from 'express';
import models from '../models';
import auth from '../auth';

var router = express.Router();

router.get('/', auth.login_required, (req, res, next) => {
  res.render('admin/dashboard', {
    name: 'cc'
  });
});

router.get('/post/new', auth.login_required, (req, res) => {
  res.render('admin/add-post', {
  });
});

router.get('/post/edit/:p_id', auth.login_required, (req, res) => {
  let p_id = req.params.p_id;
  models.PostModel.findOne({'_id': p_id}, (err, post) => {
    res.render('admin/add-post', {
      type: 'edit',
      post: post
    });
  });
});

router.post('/post', auth.login_required,  (req, res) => {
  let {title, markdown, tags, type} = req.body;
  let post_d = {
    title: title,
    markdown: markdown,
    tags: tags
  };
  let save_promise;
  if (type === 'new') {
    save_promise = new Promise((resolve, reject) => {
      let new_post = new models.PostModel();
      new_post.save((err, post) => {
        if (err) {
          reject(new Error('error'));
        }
        resolve(post);
      });
    });
  } else {
    let p_id = req.body.p_id;
    save_promise = new Promise((resolve, reject) => {
      models.PostModel.update({'_id': p_id}, {$set: post_d}, (err, post)=> {
        if (err) {
          reject(new Error('error'));
        }
        resolve(post);
      });
    });
  }
  save_promise.then((post) => {
    res.render('admin/add-post', {});
  });
});

module.exports = router;
