var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//#############################################################
//LANDING ROUTE
router.get("/", function(req, res) {
    res.render("landing");
});

//#############################################################
//SHOW REGISTER FORM
router.get("/register", function(req, res) {
    res.render("register");
});

//HANDLE SIGN UP LOGIC
router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to Slideshow" + user.username);
            res.redirect("/pictures");
        });
    });
});

//#############################################################
//SHOW LOGIN FORM
router.get("/login", function(req, res) {
    res.render("login");
});

//HANDLE LOGIN LOGIC
router.post("/login", passport.authenticate("local", {
    successRedirect: "/pictures",
    failureRedirect: "/login"
}), function(req, res) {});

//#############################################################
//LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "LOGGED OUT!!");
    res.redirect("/pictures");
});


module.exports = router;