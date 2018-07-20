const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: String,
	username: String,
	password: String,
	email: String,
	event: String,
	number: String,
	userType:  {type: String, enum: ["VNT", "LDR", "SHANNA"], default: "VNT"}
	}
);

const User = mongoose.model("User", userSchema);

module.exports = User;