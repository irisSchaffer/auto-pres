var express = require('express');
var router = express.Router();
var requestify = require('requestify');

var AYLIENTextAPI = require("aylien_textapi");
var textapi = new AYLIENTextAPI({
  application_id: "80889f4e",
  application_key: "48d80b752d6cd44405ade5da12080d06"
});

var googleAPIKey = "AIzaSyDjP8xj-TC_meQ4-gtoFVKr65yCpk1HPOc";
var customSearchID = "008009853809126469287:uldov4hqocq";
var numOfReturnedImgs = 5;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'auto-pres' });
});

router.post('/', function(req, res, next) {
	var text = req.body['speech'];
	console.log(text);

	textapi.entities(text, function(error, response) {
		var keys = "";
		if (error === null) {
			Object.keys(response.entities).forEach(function(e) {
				keys += e + ": " + response.entities[e].join(",");
				//console.log(e + ": " + response.entities[e].join(","));
			});
		}
		console.log(keys);
        res.render('index', { title: 'auto-presi', keywords: keys });
	});
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

function getImg(keyword) {
	requestify.get('https://www.googleapis.com/customsearch/v1?q=' + keyword + '&cx=' + customSearchID + '&imgSize=xlarge&num=' + numOfReturnedImgs + '&searchType=image&key=' + googleAPIKey)
		.then(function(response) {
			for (var i=0; i<response.getBody()["items"].length; i++) {
				console.log(response.getBody()["items"][i]["link"]);
			}
		}
	);
}

module.exports = router;
