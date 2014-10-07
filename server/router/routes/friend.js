var express = require('express');
var router = express.Router();

var neo4j = require('neo4j-js');

router.get('/:userID', function (req, res) {
	var userID = parseInt(req.param('userID'));

	var query = [
		"MATCH (:User {id: {id}})-[:FRIENDS]-(friend:User)",
		"RETURN friend.id;"
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

router.post('/add', function (req, res) {
	console.log(req.body);

	var userID = Number(req.body.userID);
	var friendID = Number(req.body.friendID);

	var query = [
		"MATCH (user:User {id: {userID}}), (friend:User {id: {friendID}})",
		"CREATE UNIQUE (user)-[r:FRIENDS]-(friend)",
		"RETURN r;"
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
			graph.query(query.join('\n'), { userID: userID, friendID: friendID }, function (err, results) {
				if (err) {
					console.log(err);
					console.log(err.stack);
					// send the error
					res.status(500).json({
						'message': 'Error executing query.'
					});
				}
				if (results) {
					// console.log(JSON.stringify(results, null, 5 ));
					res.status(200).json({'message': 'Friend succesfully added!'});
				}
			});
		}

	});

});

module.exports = router;