/**
* Database Interface
**/

var mongoose = require('mongoose');
var ArtistModel = require('./schemas/artist');

//Connections
var developmentDb = 'mongodb://localhost/test';
var productionDb = 'mongodb://localhost/test';
var usedDb;


if (process.env.NODE_ENV === 'development') {
	usedDb = developmentDb;
}

if (process.env.NODE_ENV === 'production') {
	usedDb = productionDb;
}

mongoose.connect(usedDb);
var db = mongoose.connection;

// Logs that the connection has successfully been opened
db.on('error', console.error.bind(console, 'connection error:'));
// Open the connection
db.once('open', function callback () {
	console.log('Database Connection Successfully Opened at ' + usedDb);
});


exports.artists = ArtistModel;