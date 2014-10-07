/**
* Schema for Artist
**/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Artist Schema
var artistSchema = new Schema({
	_id: Number,
	name: String,
	url: String,
	pictureUrl: String,
	tags: Array
}, {
	collection: 'Artists'
});

var Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;