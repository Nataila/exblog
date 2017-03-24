import express from 'express';
import async from 'async';
import models from '../models';
import auth from '../auth';
import mongoose from 'mongoose';
import pug from 'pug';
var router = express.Router();

pug.filters.testfilter = function (text) {
  console.log(text);
};

router.get('/', auth.login_required, (req, res, next) => {
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
  async.parallel({
    post: cb => {
      models.PostModel.findOne({'_id': p_id}, (err, post) => {
        cb(null, post);
      });
    },
    tags: cb => {
      models.TagsModel.find({}, (err, tags) => {
        cb(null, tags);
      });
    }
  }, (err, results) => {
    results.ptype = 'edit';
    res.render('admin/add-post', results);
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

var getTags = tags => {
  return new Promise((resolve, reject) => {
    models.TagsModel.find({'_id': {$in: tags}},{'name': 1}, (err, doc) => {
      resolve(doc);
    });
  });
};

var CreateOrUpdate = (req, post_d) => {
  let ptype = req.body.ptype;
  let save_promise;
  if (ptype === 'new') {
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
        resolve({'_id': p_id});
      });
    });
  }
  return save_promise;
};

router.post('/post', auth.login_required,  (req, res) => {
  let {title, markdown, tags, ptype} = req.body;
  let post_d = {
    title: title,
    markdown: markdown,
    tags: tags
  };
  getTags(tags).then(tagsDocs=> {
    post_d.tags = tagsDocs;
    CreateOrUpdate(req, post_d).then((post) => {
      return res.redirect(`/post/detail/${post._id}`);
    });
  });
});

module.exports = router;
