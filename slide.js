var express = require("express"),
    slide = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash"),
    passport = require("passport"),
    methodOverride = require("method-override"),
    Picture = require("./models/picture"),
    User = require("./models/user"),
    Comment = require("./models/comment");


//ROUTES REQUIRED
var indexRoutes = require("./routes/index"),
    pictureRoutes = require("./routes/pictures"),
    commentRoutes = require("./routes/comments");


//SETTING PACKAGES
var url = process.env.DATABASEURL || "mongodb://localhost/Picture";
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.connect(url);

slide.use(bodyParser.urlencoded({ extended: true }));

slide.set("view engine", "ejs");
slide.use(express.static(__dirname + "/public"));
slide.use(flash());
slide.use(methodOverride("_method"));


//PASSPORT CONFIGURATION
slide.use(require("express-session")({
    secret: "1st Website",
    resave: false,
    saveUninitialized: false
}));
slide.use(passport.initialize());
slide.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


slide.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


slide.use("/", indexRoutes);
slide.use("/pictures", pictureRoutes);
slide.use("/pictures/:id/comments", commentRoutes);


slide.listen(process.env.PORT || 8000, process.env.IP, function() {
    console.log("SlideSHOW server started");
});