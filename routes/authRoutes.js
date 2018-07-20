// routes/auth-routes.js
const passport = require("passport");
const express = require("express");
const authRoutes = express.Router();
const ensureLogin = require("connect-ensure-login");

// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//SignUp
authRoutes.get("/signup", (req, res, next) => {
  res.render("signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.Name;
  const email = req.body.email;

  if (username === "" || password === "" || name === "" || email === "") {
    res.render("signup", { message: "Missing Fields" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      name,
	  username,
      password: hashPass,
	  email
    });

    newUser.save((err) => {
      if (err) {
        res.render("signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

//Login
authRoutes.get("/login", (req, res, next) => {
  res.render("login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login", 
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  //console.log(req.session);
  
  User.findById(req.session.passport.user)
  .then((theUser) =>{
	  //console.log(theUser);
	  if(theUser.userType === "VNT")
		  res.redirect("/volunteer");
	  if(theUser.userType === "LDR")
		  res.render("private-page", { user: req.user });
	  else if(theUser.userType === "SHANNA"){
		  //res.render("Shanna/shannaView", { user: req.user });
		  res.redirect('/shannaView');
		  console.log("user is overlord shanna");
	  }
  })
  .catch(error => {
    next(error)
  })
  
  //res.render("private-page", { user: req.user });
});

// Logout
authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = authRoutes;