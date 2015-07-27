
/**
* Incrementing listening count
* creating a new listen element if artistID is not present
**/
var artistID, userID;

if (!db.users.findAndModify({
	query: { userID: userID, 'listen.artistID': artistID },
	update: { $inc: { 'listen.$.count': 1 } },
	new: true
})) {
	db.users.update(
		{ userID: userID }, 
		{
			$addToSet: {
				listen: { artistID: artistID, count: 1 }
			}
		}
	);
}

/**
* Adding a friend
* adding friendID to the user document's friendID array,
* similarly to the specified friend's user document
**/
var userID = 4;
var friendID = 1;

db.users.update(
	{ userID: userID },
	{ $addToSet: 
		{ friendID: friendID }
	}
)

db.users.update(
	{ userID: friendID },
	{ $addToSet: 
		{ friendID: userID }
	}
)

/**
* Tagging an artist
* adding userID to the userID array
**/

if( !db.artists.findAndModify({
	query: { artistID: artistID, 'tags.tag': tag },
	update: {
		$addToSet: {
			'tags.$.userID': userID
		}
	}
})) {
	db.artists.update(
		{ artistID: artistID, 'tags.tag': { $ne: tag } },
		{ $addToSet: { 
			tags: { tag: tag, userID: [userID] }
		}}
	)
}

/**
* Top 5 Recommendations
**/

/* By sum of friend's listening count */
var user = db.users.findOne(
 { userID: userID },
 { friendID: 1, 'listen.artistID': 1}
);

if (user) {
	// extract artistID into an array of integers
	// instead of an array of objects
	var listenTem = user.listen
	user.listen = []
	listenTem.forEach( function(element) {
		user.listen.push(element.artistID)
	});

	db.users.aggregate([
		{ $match: { userID: { $in: user.friendID } } },
		{ $project: { _id:0, listen: 1 }},
		{ $unwind: '$listen' },
		{ $match: { 'listen.artistID': { $nin: user.listen } } },
		{ $group: {
			_id: '$listen.artistID',
			count: { $sum: '$listen.count' }
		} },
		{ $project: { _id: 0, artistID: '$_id', count: 1} },
		{ $sort: { count: -1 }},
		{ $limit: 5 }
	])
}

/* By the amount of friends listening */
var user = db.users.findOne(
 { userID: userID },
 { friendID: 1, 'listen.artistID': 1}
);

if (user) {
	// extract artistID into an array of integers
	// instead of an array of objects
	var listenTem = user.listen
	user.listen = []
	listenTem.forEach( function(element) {
		user.listen.push(element.artistID)
	});

	db.users.aggregate([
		{ $match: { userID: { $in: user.friendID } } },
		{ $project: { _id:0, listen: 1 }},
		{ $unwind: '$listen' },
		{ $match: { 'listen.artistID': { $nin: user.listen } } },
		{ $group: {
			_id: '$listen.artistID',
			sum: { $sum: 1 }
		} },
		{ $project: { _id: 0, artistID: '$_id', sum: 1} },
		{ $sort: { sum: -1 }},
		{ $limit: 5 }
	])
}

/* By unique listener to tags you have used  */
var user = db.users.findOne(
 { userID: userID },
 { friendID: 1, 'listen.artistID': 1}
);

var listen = [];

// retrieve list of artist user have listened to
user.listen.forEach(function (element) {
	listen.push(element.artistID)
})

// retrieve a tag used by the users
var query = db.artists.findOne(
	{ 'tags.userID': userID },
	{ 'tags.$.tag': 1 }
)

if (query.tags.length > 0) {
	var tag = query.tags[0].tag;
}

// retrieve a list of artist who was tagged with the chosen tag
var artistRec = db.artists.aggregate([
	{ $match: { 'tags.tag': tag, artistID: { $nin: listen } } },
	{ $project: {
		_id: 0,
		artistID: 1,
		'tags.tag': { $eq: tag }
	} }
	{ $group: {
		_id: 'tags.tag'
	} }
]);








