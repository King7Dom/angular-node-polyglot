var express = require('express');
var router = express.Router();

var neo4j = require('neo4j-js');

router.get('/tag/:userID', function (req, res) {
	var userID = parseInt(req.param('userID'));

	var query = [
		"MATCH (:User{id:{id}})-[queryTag:TAGGED]->(:Artist)",
		"WITH queryTag.tag AS userTag LIMIT 1",
		"MATCH (:User)-[artistTag:TAGGED]->(artist:Artist)",
		"WHERE artistTag.tag = userTag AND NOT (:User {id:{id}})-[:LISTENS_TO]->(artist)",
		"WITH artist, artistTag.tag AS resultTag",
		"MATCH (:User)-[listen:LISTENS_TO]->(artist)",
		"RETURN artist.id AS id, artist.name AS name, resultTag, count(listen) AS uniqueListener",
		"ORDER BY count(listen) DESC LIMIT 5"
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
			graph.query(query.join('\n'), { id: userID }, function (err, results) {
				if (err) {
					console.log(err);
					console.log(err.stack);
					// send the error
					res.status(500).json({
						'message': 'Error executing query.'
					});
				}
				else {
					console.log(JSON.stringify(results, null, 5 ));
					res.status(200).json(results);
				}
			});
		}

	});

});

router.get('/count/:userID', function (req, res) {
	userID = parseInt(req.param('userID'));

	var query = [
		"MATCH (user:User {id: {id}})-[:FRIENDS]-(friend:User)-[listen:LISTENS_TO]->(artist:Artist)",
		"WHERE NOT (user)-[:LISTENS_TO]->(artist)",
		"RETURN artist.id AS id, artist.name AS name, count(listen) AS count",
		"ORDER BY count(listen) DESC LIMIT 5"
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
			graph.query(query.join('\n'), { id: userID }, function (err, results) {
				if (err) {
					console.log(err);
					console.log(err.stack);
					// send the error
					res.status(500).json({
						'message': 'Error executing query.'
					});
				}
				else {
					console.log(JSON.stringify(results, null, 5 ));
					res.status(200).json(results);
				}
			});
		}

	});

});

router.get('/sum/:userID', function (req, res) {
	userID = parseInt(req.param('userID'));

	var query = [
		"MATCH (user:User {id: {id}})-[:FRIENDS]-(friend:User)-[listen:LISTENS_TO]->(artist:Artist)",
		"WHERE NOT (user)-[:LISTENS_TO]->(artist)",
		"RETURN artist.id AS id, artist.name AS name, sum(listen.count) AS sum",
		"ORDER BY sum(listen.count) DESC LIMIT 5"
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
			graph.query(query.join('\n'), { id: userID }, function (err, results) {
				if (err) {
					console.log(err);
					console.log(err.stack);
					// send the error
					res.status(500).json({
						'message': 'Error executing query.'
					});
				}
				else {
					console.log(JSON.stringify(results, null, 5 ));
					res.status(200).json(results);
				}
			});
		}

	});

});

module.exports = router;