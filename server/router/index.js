/**
 * The Index of Routes
 */

module.exports = function (app) {
	app.use('/api/recommend', require('./routes/recommend'));
	app.use('/api/artist', require('./routes/artist'));
	app.use('/api/friend', require('./routes/friend'));
}
