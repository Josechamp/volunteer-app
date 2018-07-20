const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const event = new Schema({
	leader: String,
	volunteers: Array,
	location: String,
	time: String,
	grade: String
});

const Event = mongoose.model("Event", event);

module.exports = Event;