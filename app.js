var bodyParser = require("body-parser");
var express = require("express");
var mongoose = require("mongoose");
var app = express();

mongoose.connect("mongodb://localhost/restful_blog_app" , { useNewUrlParser: true });
app.set("view-engine" , "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date , default: Date.now},
});

var Blog = mongoose.model("Blog" , blogSchema);

//RESTful Routes
app.get("/" , function(req , res){
    res.redirect("/blogs");
})

//NEW ROUTE
app.get("/blogs/new" , function(req , res){
    res.render("new.ejs");
});

app.post("/blogs" , function(req , res){
    Blog.create(req.body.blog , function(err , newBlog){
        if(err){
            console.log("Something Went Wrong");
        }else{
            res.redirect("/blogs");
        }
    })
});

app.get("/blogs" , function(req , res){
    Blog.find({} , function(err , blogs){
        if(err){
            console.log("Something Went Wrong!!");
        }else{
            res.render("index.ejs" , {blogs: blogs});
        }
    })
});

app.listen(3000 , function(){
    console.log("Blog Server Started at PORT 3000");
})