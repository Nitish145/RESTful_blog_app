var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var app = express();
var expressSanitizer = require("express-sanitizer");
var methodOverride = require("method-override");

mongoose.connect("mongodb://localhost/restful_blog_app", 
    { 
        useNewUrlParser: true, 
        useFindAndModify: false 
    });
app.set("view-engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now },
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTful Routes
app.get("/", function (req, res) {
    res.redirect("/blogs");
})

//GET ROUTE
app.get("/blogs", function (req, res) {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log("Something Went Wrong!!");
        } else {
            res.render("index.ejs", { blogs: blogs });
        }
    })
});

//NEW ROUTE
app.get("/blogs/new", function (req, res) {
    res.render("new.ejs");
});

//CREATE ROUTE
app.post("/blogs", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function (err, newBlog) {
        if (err) {
            console.log("Something Went Wrong");
        } else {
            res.redirect("/blogs");
        }
    })
});

//SHOW ROUTE
app.get("/blogs/:id", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("show.ejs", { blog: foundBlog });
        }
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit", function (req, res) {
    Blog.findById(req.params.id, function (err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit.ejs", { blog: foundBlog});
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id", function (req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id", function (req, res) {
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    })
})

app.listen(3000, function () {
    console.log("Blog Server Started at PORT 3000");
})