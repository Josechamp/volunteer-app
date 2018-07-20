const express = require("express");
const shannaRoutes = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

const User = require("../models/User");
const School = require("../models/School");
const Event = require("../models/Event");

shannaRoutes.get("/addEvent", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  //res.render("Shanna/addEvent");
  
  User.find()
	.then((theUsers) =>  {	   
		
		School.find()
			.then((theSchool) => {
				
			Event.find()
				.then((theEvent) => {
					//console.log(theSchool);
					res.render('Shanna/addEvent', {Users : theUsers, Schools : theSchool, Events: theEvent});
				})
				.catch((daError) => { console.log("Error of some kind") })
			})
			.catch((daError) => { console.log("Error of some kind") })
	})
	.catch((daError) => { console.log("Error of some kind") })
});

shannaRoutes.post("/addEvent", (req, res, next) => {
  const leader = req.body.leader;
  const location  = req.body.location;
  const time = req.body.time;
  const grade = req.body.grade;

  if (leader === "" || location === "" || time === "" || grade === "") {
    res.render("Shanna/addEvent", { message: "Missing Fields" });
    return;
  }

   const newEvent = new Event({
     leader,
	 location,
     time,
	 grade
   });

    newEvent.save((err) => {
      if (err) {
        res.render("Shanna/addEvent", { message: "Something went wrong" });
      } else {
        res.redirect("/addEvent");
      }
  })
  .catch(error => {
    next(error)
  })

});

shannaRoutes.get("/addSchool", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  
  School.find()
	.then((theSchool) => {
		//console.log(theSchool);
		res.render('Shanna/addSchool', {Schools : theSchool});
	})
	.catch((daError) => { console.log("Error of some kind") });
  
  //res.render("Shanna/addSchool");
  
});

shannaRoutes.post("/addSchool", (req, res, next) => {
  const name = req.body.name;
  const location = req.body.location;
  const POC = req.body.POC;
  const number = req.body.number;
  const description = req.body.number;

  if (name === "" || location === "" || POC === "" || number === "" || description === "") {
    res.render("Shanna/addSchool", { message: "Missing Fields" });
    return;
  }

  School.findOne({ name })
  .then(user => {
    if (user !== null) {
      res.render("Shanna/addSchool", { message: "School already Exists" });
      return;
    }

    const newSchool = new School({
      name,
	  location,
      POC,
	  number,
	  description
    });

    newSchool.save((err) => {
      if (err) {
        res.render("Shanna/addSchool", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});

shannaRoutes.get("/shannaView", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  
    /*if(!isShanna(req, next)){
	  res.redirect('/');
	  return;
    }  */
	
	User.findById(req.session.passport.user)
	   .then((theUser) =>{
		   console.log(theUser);
		   
		   if(theUser.userType === "SHANNA")
			   res.render("Shanna/shannaView", {User: theUser});
		   else
			   res.redirect('/');
	   })
	   .catch(error => {
		   next(error)
	})
  
  //res.render("Shanna/shannaView");
  
});

shannaRoutes.get("/shannaView/manageVolunteers", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  //res.render("Shanna/addEvent");
  
  User.find()
	.then((theUsers) =>  {	   
		
		res.render('Shanna/manageVolunteers', {Users : theUsers});

	})
	.catch((daError) => { console.log("Error of some kind") })
});

shannaRoutes.post("/ban/:id", ensureLogin.ensureLoggedIn(), (req, res, next) => {
  //res.render("Shanna/addEvent");
  
  User.remove({ _id: req.params.id }, function(err) {
    if (!err) {
			console.log("removing " + req.params.id);
			res.redirect('/shannaView/manageVolunteers');
    }
    else {
            console.log("Error");
    }
});
  
  
  /*req.params.id)
	.then(() =>  {	   
		console.log("removing " + req.params.id);
		res.redirect('/shannaView/manageVolunteers');

	})
	.catch((daError) => { console.log("Error of some kind") })*/
});

module.exports = shannaRoutes;





