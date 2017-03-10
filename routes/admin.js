import express from 'express';
import async from 'async';
import models from '../models';
import auth from '../auth';
var router = express.Router();

router.get('/', auth.login_required, (req, res, next) => {
  let ctx = {};
  async.parallel({
    posts: cb => {
      models.PostModel.find({}, (err, posts) => {
        cb(null, posts);
      });
    },
    tags: cb => {
      models.TagsModel.find({}, (err, tags) => {
        cb(null, tags);
      });
    }
  }, (err, results) => {
    res.render('admin/dashboard', results);
  });
});

router.get('/post/new', auth.login_required, (req, res) => {
  models.TagsModel.find({}, (err, tags) => {
    res.render('admin/add-post', {
      tags: tags
    });
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

router.get('/post/del/:p_id', auth.login_required, (req, res) => {
  let p_id = req.params.p_id;
  models.PostModel.remove({'_id': p_id}, (err, post) => {
    res.redirect('/admin');
  });
});

router.post('/tag/new', auth.login_required, (req, res) => {
  let name = req.body.name;
  let new_tag = new models.TagsModel({'name': name});
  new_tag.save((err, tag) => {
    res.redirect('/admin');
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
      let new_post = new models.PostModel(post_d);
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
    return res.redirect(`/post/detail/${post._id}`);
  });
});

module.exports = router;
