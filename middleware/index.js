var Picture = require("../models/picture");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.CheckPictureOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Picture.findById(req.params.id, function(err, foundpicture) {
            if (err) {
                req.flash("error", "Picture NOT FOUND");
                res.redirect("back");
            } else {
                if (foundpicture.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "YOU DON'T HAVE PERMISSION TO DO THAT");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back")
    }
}


middlewareObj.CheckCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                // does user own the comment?
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;