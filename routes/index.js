var express = require('express');
var router = express.Router();

var Q = require('q');
var requestify = require('requestify');

var AYLIENTextAPI = require("aylien_textapi");
var textapi = new AYLIENTextAPI({
    application_id: "80889f4e",
    application_key: "48d80b752d6cd44405ade5da12080d06"
});

var googleAPIKey = "AIzaSyD5jRudi7HuJnQvTjXA8dCV3BM6zlMZDkg";
var customSearchID = "008009853809126469287:uldov4hqocq";
var numOfReturnedImgs = 1;
var imageSize = 'xlarge';

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.session);
    req.session.test = "test";
    res.render('index', { title: 'auto-pres' });
});

/**
 * Get route for presentation. If session with presentation was previously set, uses this presentation, otherwise
 * redirects to start page.
 * This is necessary for the speaker notes which send a request to /presentations again.
 */
router.get('/presentation', function(req, res, next) {
    console.log(req.session);
    if (req.session && req.session.presentation) {
       res.render('presentation',
           {
               layout: '',
               presentation: req.session.presentation
           }
       );
    } else {
       res.redirect('/');
    }
});

/**
 * Post route for /presentation. Takes the speech that is sent per POST and creates a presentation out of it.
 * This presentation is also stored in the session for accessing speaker notes (see presentation get route).
 */
router.post('/presentation', function(req, res, next) {
    console.log(req.session);
	var text = req.body['speech'];
	var paragraphs = [];
	// TODO: SEVERAL RETURNS COULD BE BAD 
	paragraphs = text.split("\n\r\n");
	debuginfo = "";

    console.log("getting keywords for paragraphs");
	Q.all(paragraphs.map(getKeywordForParagraph)).done(function (presentation) {
        presentation = removeEmptyKeywords(presentation);
        presentation.map(addSearchTermFromKeywords);

        console.log("getting images for keyword");
		Q.all(presentation.map(addImg)).done(function (presentation) {

            console.log("rendering");
            req.session.presentation = presentation;
            console.log(req.session);
            res.render('presentation',
                {
                    layout: '',
                    presentation: presentation
                }
            );
        });
	});
});


/**
 * Returns promise for keywords found for provided paragraph.
 * If no keywords are found, appends the paragraph to the next one, which is why we need index and paragraphs.
 * @param paragraph
 * @param index
 * @param paragraphs
 * @returns {*|promise} promise resolved to an object of text and keywords or rejected as error
 */
function getKeywordForParagraph (paragraph, index, paragraphs) {
	var deferred = Q.defer();
	
	textapi.entities(paragraph, function(error, response) {
        var keys = "";
        if (error === null) {
            Object.keys(response.entities).forEach(function(e) {
                keys += e + ": " + response.entities[e].join(",");
            });

            // TODO: IF TEXT HAS NO KEYWORDS, IT CRASHES!
            // TODO: Check if this looks right in the notes
            if (!response.entities['keyword']) {
                paragraphs[index] = paragraph + paragraphs[index];

            }

            deferred.resolve({
                'text': paragraph,
                'keywords': response.entities['keyword']
            });

        } else {
            deferred.reject(error);
        }
    });

	return deferred.promise;
}

/**
 * Method returning search term for keywords. For now just take the first keyword.
 * @param keywords array of keywords
 * @returns string
 */
function addSearchTermFromKeywords(slide) {
    slide['searchTerm'] = slide.keywords[0];
}

/**
 * Removes slides with empty keywords from presentation
 * @param presentation
 */
function removeEmptyKeywords(presentation) {
    return presentation.filter(function(slide) {
        return (slide.keywords != undefined);
    });
}

/**
 * Method returning image-uris for a search-term
 * @param slide
 * @returns {*|promise}
 */
function addImg(slide) {
	var deferred = Q.defer();
	console.log('https://www.googleapis.com/customsearch/v1?q=' + slide.searchTerm + '&cx=' + customSearchID + '&imgSize=' + imageSize + '&num=' + numOfReturnedImgs + '&searchType=image&key=' + googleAPIKey);
	requestify.get('https://www.googleapis.com/customsearch/v1?q=' + slide.searchTerm + '&cx=' + customSearchID + '&imgSize=' + imageSize + '&num=' + numOfReturnedImgs + '&searchType=image&key=' + googleAPIKey)
		.then(function(response) {

            slide['img_url'] = response.getBody()["items"][0]["link"];
			deferred.resolve(slide);
		}
	);
	
	return deferred.promise;
}

module.exports = router;
