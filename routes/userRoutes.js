const passport = require("passport");
const express = require("express");
const userRoutes = express.Router();
const ensureLogin = require("connect-ensure-login");

const User = require("../models/User");
const Events = require("../models/Event");

userRoutes.get("/profile/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  
  User.findById(req.params.id)
   .then((theUser)=>{

        res.render('User/profile', {User: theUser})
   
   })
   .catch((err)=>{
       next(err);
   })
  
});

userRoutes.get("/profile/:id/editProfile", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  
  User.findById(req.params.id)
   .then((theUser)=>{

        res.render('User/editProfile', {User: theUser})
   
   })
   .catch((err)=>{
       next(err);
   })
  
});

userRoutes.post("/profile/:id/updateProfile", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  
   User.findByIdAndUpdate(req.params.id, {
        name: req.body.Name,
        email: req.body.email,
        username: req.body.username,
        number: req.body.number
    })
    .then((theUser)=>{
        res.redirect('/profile/'+theUser._id)
    })
    .catch((err)=>{
        next(err);
    })  
  
});

userRoutes.get("/volunteer", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  
  User.findById(req.session.passport.user)
   .then((theUser)=>{
		console.log(theUser);
        res.render('User/userView', {User: theUser})
   
   })
   .catch((err)=>{
       next(err);
   })
  
});

userRoutes.get("/volunteer/eventSignup", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  
  Events.find()
	.then((theEvent) => {
		//console.log(theSchool);
		res.render('User/eventSignup', {Events : theEvent});
	})
	.catch((daError) => { console.log("Error of some kind") });
  
});

module.exports = userRoutes;