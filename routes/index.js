var express = require('express');
var router = express.Router();

var AYLIENTextAPI = require("aylien_textapi");
var textapi = new AYLIENTextAPI({
  application_id: "80889f4e",
  application_key: "48d80b752d6cd44405ade5da12080d06"
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {
	var text = req.body['textinput'];
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
		res.render('index', { title: "Express", keywords: keys });
	});
});

module.exports = router;



