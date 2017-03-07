import express from 'express';
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

module.exports = router;
