/**
* API path for anything related to artists
**/

var express = require('express');
var router = express.Router();
var db = require('../../database');
var Artists = db.artists;


router.get('/:artistID', function (req, res) {
	var artistID = parseInt(req.param('artistID'));

	Artists.findOne({'_id': artistID}, function (err, artist) {
		if (err) {
			console.log('Couldn\'t connect to mongodb because of: ' + err);

			// send the error
			res.status(500).json({
				'message': 'Internal server error.'
			});
		}

		if (artist) {
			console.log(JSON.stringify(artist, null, 5 ));
			res.status(200).json(artist);
		} else {
			res.status(409).json({
             'message': 'No artist with id: ' + artistID + ' exist'
         });

		}
	});
});

router.get('/thumbnail/:artistID', function (req, res) {
	var artistID = parseInt(req.param('artistID'));
	console.log('ArtistID: '+artistID);

	Artists.findOne({'_id': artistID}, {_id:1,name:1,pictureUrl:1}, {lean:true} , function (err, artist) {
		if (err) {
			console.log('Couldn\'t connect to mongodb because of: ' + err);

			// send the error
			res.status(500).json({
				'message': 'Internal server error.'
			});
		}

		if (artist) {
			console.log(JSON.stringify(artist, null, 5 ));
			res.status(200).json(artist);
		} else {
			res.status(409).json({
             'message': 'No artist with id: ' + artistID + ' exist'
         });

		}
	});
});


module.exports = router;