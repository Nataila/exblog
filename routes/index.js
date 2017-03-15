import crypto from 'crypto';
import express from 'express';
import models from '../models';
import config from '../config';
import async from 'async';

var router = express.Router();

/* GET home page. */

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', '未登录!'); 
    res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登录!'); 
    res.redirect('back');//返回之前的页面
  }
  next();
}

function getTagname(text, cb) {
  models.TagsModel.findOne({'_id': text}, function (err, doc) {
    return cb(doc);
  });
}

router.get('/', function(req, res, next) {
  let page = req.query.page || 1;
  let startNum = page===1 ? 0 : (page-1) * config.pageCount;
  let getPosts =  new Promise((resolve, reject) => {
    models.PostModel.find()
      .skip(startNum)
      .limit(config.pageCount)
      .exec(function (err, doc) {
        resolve(doc);
      });
  });

  let getTotalCount = new Promise(resolve => {
    models.PostModel.find().count().then((err, count) => {
      resolve(count);
    });
  });

  async.parallel({
    posts: (cb) => {
      models.PostModel.find()
        .skip(startNum)
        .limit(config.pageCount)
        .exec(function (err, doc) {
          cb(null, doc);
        });
    },
      totalCount: (cb) => {
        models.PostModel.find().count().then((count) => {
          cb(null, count);
        });
    }
  }, (err, result) => {
    result.user = req.session.user;
    result.title = '大表哥';
    res.render('index', result);
  });
  // getPosts.then((posts) => {
  //   result.user = req.session.user;
  //   result.posts = posts;
  //   res.render('index', result);
  // });
});

router.get('/login', checkNotLogin);
router.get('/login', function (req, res, next) {
  res.render('login', {
    welcome_text: config.welcome_text,
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/login', function (req, res, next) {
  let md5 = crypto.createHash('md5'),
    password = md5.update(req.body.password).digest('hex');
  models.UserModel.findByName(req.body.username).then(user => {
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/login');
    }
    if (user.password !== password) {
      req.flash('error', '密码错误');
      return res.redirect('/login');
    }
    req.session.user = user;
    req.flash('success', '登陆成功');
    res.redirect('/admin');
  });
});

// router.get('/reg', checkNotLogin);
// router.get('/reg', function (req, res, next) {
//   res.render('reg', { title: 'Express' });
// });
// 
// router.post('/reg', function (req, res) {
//   var name = req.body.name,
//     password = req.body.password,
//     password_re = req.body['password-repeat'];
//   if (password !== password_re) {
//     req.flash('error', '两次输入不一样');
//     return res.redirect('/reg');
//   }
//   var md5 = crypto.createHash('md5'),
//     hex_password = md5.update(password).digest('hex');
//   var newUser = new models.UserModel({
//     username: name,
//     password: hex_password,
//     email: req.body.email
//   });
//   newUser.save((err, user) => {
//     req.session.user = user;
//     req.flash('success', '注册成功!');
//     res.redirect('/');
//   });
// });
// 
// router.get('/logout', function (req, res, next) {
//   req.session.user = null;
//   req.flash('success', '注销成功');
//   res.redirect('/');
// });

module.exports = router;
