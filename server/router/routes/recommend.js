var express = require('express');
var router = express.Router();

router.get('/tag/:userID', function (req, res) {
	userID = req.param('userID');
	console.log(userID);
	res.json({
		'msg': 'UserID: ' + userID
	});
});

module.exports = router;