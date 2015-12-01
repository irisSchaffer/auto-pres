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

router.post('/slides', function(req, res, next) {
	console.log(req.body);
});

module.exports = router;

var AYLIENTextAPI = require("aylien_textapi");
var textapi = new AYLIENTextAPI({
  application_id: "80889f4e",
  application_key: "48d80b752d6cd44405ade5da12080d06"
});

var text = "John is a very good football player!";

textapi.sentiment({"text": text}, function(error, response) {
  if (error === null) {
    console.log(response);
  }
});

textapi.language({"text": text}, function(error, response) {
  if (error === null) {
    console.log(response);
  }
});