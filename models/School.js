const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const school = new Schema({
	name: String,
	location: String,
	point_of_contact: String,
	number: String,
	description: String,
	events: Array
});

const School = mongoose.model("School", school);

module.exports = School;