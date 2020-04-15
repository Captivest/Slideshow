var express = require("express");
var router = express.Router();
var Picture = require("../models/picture");
var middleware = require("../middleware")


//#############################################################
//INDEX - SHOW ALL PICTURES
router.get("/", function(req, res) {
    Picture.find({}, function(err, allpictures) {
        if (err) {
            console.log(err);
        } else {
            res.render("pictures/index", { pictures: allpictures });
        }
    });
});

//#############################################################
//CREATE-ADD NEW PICTURE TO DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPicture = {
        name: name,
        image: image,
        description: desc,
        author: author
    };
    Picture.create(newPicture, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/pictures");
        }
    });
});

//#############################################################
//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("pictures/new");
});

//#############################################################
//SHOW
router.get("/:id", function(req, res) {
    Picture.findById(req.params.id).populate("comments").exec(function(err, foundpicture) {
        if (err) {
            console.log(err);
        } else {
            res.render("pictures/show", { picture: foundpicture });
        }
    });
});


//#############################################################
//EDIT
router.get("/:id/edit", middleware.CheckPictureOwnership, function(req, res) {
    Picture.findById(req.params.id, function(err, foundpicture) {
        res.render("pictures/edit", { picture: foundpicture });
    });
});

//#############################################################
//UPDATE
router.put("/:id", middleware.CheckPictureOwnership, function(req, res) {
    Picture.findByIdAndUpdate(req.params.id, req.body.picture, function(err, updatedPicture) {
        if (err) {
            res.redirect("/pictures");
        } else {
            res.redirect("/pictures/" + req.params.id);
        }
    });
});


//#############################################################
//REMOVE
router.delete("/:id", middleware.CheckPictureOwnership, function(req, res) {
    Picture.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/pictures");
        } else {
            res.redirect("/pictures");
        }
    });
});


module.exports = router;