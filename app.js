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

const welcomePost = new Post({
  title: "Welcome!",
  body: "Welcome to your new Blog Website! This website was developed by Michael Valenti using JavaScript, EJS, HTML, CSS, and MongoDB."
});


const homeStartingContent = {
  title: "Home",
  body: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing."
};

const aboutContent = {
  title: "About",
  body: "My name is Michael Valenti and I am a Web Developer!"
};

const contactContent = {
  title: "Contact",
  body: "For business inquiries, please contact me by email! mvalenti14@live.com"
};


//store default posts in an array
const defaultPosts = [welcomePost];


app.get("/", (req, res)=>{
//Query the database for foundPosts
Post.find({}, (err, foundPosts) => {
  //If no posts are found
  if(foundPosts.length === 0) {
    //Insert the default posts
    Post.insertMany(defaultPosts, (err) => {
      if (err){
        console.log(err);
      } else {
        console.log("Successfully inserted default posts!");
      }
    });
    res.redirect("/");
  }
  else {
    //If default items are already present, render them to the home screen
    //along with the home starting content
      res.render("home", {posts: foundPosts, homeStartingContent});

  }
});

});

app.get("/about", (req, res)=>{

//render the about page and pass aboutContent to it
res.render("about", {aboutContent});

});

app.get("/contact", (req, res)=>{

//render the contact page and pass contactContent to it
res.render("contact", {contactContent});

});

app.get("/compose", (req, res) => {

//render the compose page
res.render("compose");

});

app.get("/posts/:postid", (req, res) => {
  //store the post id that gets clicked on
  const requestedPostId = req.params.postid;
  //find the post in the collection using the post ID
  Post.findOne({_id: requestedPostId}, (err, foundPost) =>{
    if (!err){
      res.render("post", {postTitle: foundPost.title, postBody: foundPost.body});
    } else {
      console.log(err);
    }
  });
});

//When a new post is composed and published
app.post("/", (req, res) => {
  //store title and body inside of newPost
  const newPost = new Post({
    title: req.body.postTitle,
    body: req.body.postBody
  });
//insert newPost into collection
  Post.create(newPost, (err) => {
    if (err){
      console.log(err);
    } else {
      console.log("Successfully inserted new post!");
    }
  });

  //redirect to the home page once complete
  res.redirect("/");

});










app.listen(port, function() {
  console.log("Server started on port 3000");
});
