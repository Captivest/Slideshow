var express = require("express");
var router = express.Router({ mergeParams: true });
var Picture = require("../models/picture");
var Comment = require("../models/comment");
var middleware = require("../middleware");


//#############################################################
//NEW 
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Picture.findById(req.params.id, function(err, picture) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { picture: picture });
        }
    });
});

//#############################################################
//CREATE COMMENT
router.post("/", middleware.isLoggedIn, function(req, res) {
    Picture.findById(req.params.id, function(err, picture) {
        if (err) {
            console.log(err);
            res.redirect("/pictures");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                    req.flash("error", "Something went wrong");
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    picture.comments.push(comment);
                    picture.save();
                    req.flash("success", "Comment Added Successfully");
                    res.redirect("/pictures/" + picture._id);
                }
            });
        }
    });
});

//#############################################################
//EDIT COMMENT
router.get("/:comment_id/edit", middleware.CheckCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundcomment) {
        if (err) {
            res.redirect("back")
        } else {
            res.render("comments/edit", { picture_id: req.params.id, comment: foundcomment });
        }
    });
});

//#############################################################
//UPDATE COMMENT
router.put("/:comment_id", middleware.CheckCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/pictures/" + req.params.id);
        }
    });
});

//#############################################################
//DELETE COMMENT
router.delete("/:comment_id", middleware.CheckCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment Deleted");
            res.redirect("/pictures/" + req.params.id);
        }
    });
});


module.exports = router;