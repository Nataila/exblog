import express from 'express';
import models from '../models';

const router = express.Router();

router.get('/detail/:p_id', (req, res) => {
  let p_id = req.params.p_id;
  console.log(p_id);
  models.PostModel.findOne({_id: p_id}, (err, post) => {
    res.render('detail', {
      post: post
    });
  });
});
module.exports = router;
