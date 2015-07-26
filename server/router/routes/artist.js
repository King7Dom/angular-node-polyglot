/**
* API path for anything related to artists
**/

var express = require('express');
var router = express.Router();

var neo4j = require('neo4j-js');
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

router.post('/tag', function (req, res) {
	var tagName = req.body.tagName;
	var artistID = Number(req.body.artistID);
	var userID = Number(req.body.userID);
	var time = Date.now();

	console.log(tagName);
	console.log(artistID);
	console.log(userID);
	console.log(time);

	var query = [
		"MATCH (user:User {id: {userID}}), (artist:Artist {id: {artistID}})",
		"CREATE (user)-[:TAGGED {tag: {tagName}, timestamp:{time}}]->(artist);"
	];

	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		if (err) {
			console.log('Couldn\'t connect to neo4j because of: ' + err);

			// send the error
			res.status(500).json({
				'message': 'Internal server error.'
			});
		}
		if (graph) {
			graph.query(query.join('\n'), 
				{ userID: userID, artistID:artistID, time: time, tagName:tagName }, 
				function (err, results) {
					if (err) {
						console.log(err);
						console.log(err.stack);
						// send the error
						res.status(500).json({
							'message': 'Error executing Neo4j query.'
						});
					}
					if (results) {
						console.log(JSON.stringify(results, null, 5));

						// Update tags on the Artist mongodb document
						Artists.update(
							{_id: artistID}, 
							{$addToSet: {tags:tagName}},
							function (err, numberAffected, raw) {
								if (err) {
									console.log(err);
									console.log(err.stack);
									// send the error
									res.status(500).json({
										'message': 'Error executing Mongodb update query.'
									});
								}
					  			console.log('The number of updated documents was %d', numberAffected);
					  			console.log('The raw response from Mongo was ', raw);
					  			res.status(200).json({message: 'Tag added successfully'});
							}
						);
					}
			});
		}

	});
});

router.post('/listen', function (req, res) {
	var artistID = Number(req.body.artistID);
	var userID = Number(req.body.userID);

	var query = [
		"MATCH (user:User {id: {userID}}), (artist:Artist {id: {artistID}})",
		"CREATE UNIQUE (user)-[listen:LISTENS_TO]->(artist)",
		"SET listen.count = coalesce(listen.count, 0) + 1",
		"RETURN listen.count AS listeningCount;"
	];

	neo4j.connect('http://localhost:7474/db/data/', function (err, graph) {
		if (err) {
			console.log('Couldn\'t connect to neo4j because of: ' + err);

			// send the error
			res.status(500).json({
				'message': 'Internal server error.'
			});
		}
		if (graph) {
			graph.query(query.join('\n'), 
				{ userID: userID, artistID:artistID }, 
				function (err, results) {
					if (err) {
						console.log(err);
						console.log(err.stack);
						// send the error
						res.status(500).json({
							'message': 'Error executing Neo4j query.'
						});
					}
					if (results) {
						console.log(JSON.stringify(results, null, 5));
						res.status(200).json(results);
					}
				}
			);
		}
	});
});

module.exports = router;