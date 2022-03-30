//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');
const port = 3000;

//let posts =[];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
//use static files in the folder named public
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/blogWebsiteDB");

//create posts Schema
const postsSchema = new mongoose.Schema({
  title: String,
  body: String
});

//create Post model
const Post = mongoose.model('Post', postsSchema);

//create default starting content
const homeStartingContent = new Post({
  title: "Home",
  body: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
});

const aboutContent = new Post ({
  title: "About",
  body: "My name is Michael Valenti and I am a Web Developer!"
});

const contactContent = new Post ({
  title: "Contact",
  body: ""
});



const defaultPosts = [homeStartingContent, aboutContent, contact];


app.get("/", function(req, res){

//render the home page and pass homeStartingContent and posts array to it
res.render("home", {homeStartingContent, posts});

});

app.get("/about", function(req, res){

//render the about page and pass aboutContent to it
res.render("about", {aboutContent});

});

app.get("/contact", function(req, res){

//render the contact page and pass contactContent to it
res.render("contact", {contactContent});

});

app.get("/compose", function(req, res){

//render the compose page
res.render("compose");

});

app.get("/posts/:postname", function(req, res){
  const requestedTitle = req.params.postname;

//check if there is a matching post title for the requested URL. If there is, render the post on the Post page.
posts.forEach(function(post){
  const storedTitle = post.title;
  const storedBody = post.post;
  if(_.lowerCase(storedTitle) === _.lowerCase(requestedTitle)){
    res.render("post", {post});
  }else {
    console.log("Not a match!");
  }

});



});

app.post("/", function(req, res){
  //store title and body inside of an object
  const post = {
    title: req.body.postTitle,
    post: req.body.postBody
  };
  //push the object to an array named "posts and then redirect to the homepage"
  posts.push(post);
  res.redirect("/");

});










app.listen(port, function() {
  console.log("Server started on port 3000");
});
