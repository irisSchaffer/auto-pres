var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  res.render('presentation',
  {
      layout: '',
      images: [
          {
              img_url: "http://www.planwallpaper.com/static/images/Winter-Tiger-Wild-Cat-Images.jpg",
              text: "Test Text 1"
          },
          {
              img_url: "http://www.gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg",
              text: "Test Text 2"
          },
          {
              img_url: "http://blog.jimdo.com/wp-content/uploads/2014/01/tree-247122.jpg",
              text: "Test Text 3"
          }
      ]
  });
});

module.exports = router;
