/**
 * The Index of Routes
 */

module.exports = function (app) {
	app.use('/api/recommend', require('./routes/recommend'));
}
