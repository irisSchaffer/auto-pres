var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  res.render('index', { images: [
    "http://www.planwallpaper.com/static/images/Winter-Tiger-Wild-Cat-Images.jpg",
    "http://www.gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg",
    "http://blog.jimdo.com/wp-content/uploads/2014/01/tree-247122.jpg",
  ] });
});

module.exports = router;
