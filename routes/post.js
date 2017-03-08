import express from 'express';
import models from '../models';

var router = express.Router();
router.get('/', (req, res) => {
  models.PostModel.findOne({}, (err, post) => {
    res.render('detail', {
      post: post
    });
  });
});
module.exports = router;
