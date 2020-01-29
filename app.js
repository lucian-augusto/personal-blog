// jshint esversion:6

// Requiring Modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

// Setting up some constants
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Initializing the 'app' constant with express
const app = express();

// Setting up the ejs, body parser and public folder
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Setting up MongoDB/mongoose Connection
mongoose.connect('mongodb://localhost:27017/blogDB',{useNewUrlParser:true});

// Creating schemas
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true,'The post must have a title.']
  },
  body: {
    type: String,
    required: [true,'The post must have a content']
  }
});

// Creating models
const Post = new mongoose.model('Post',postSchema);

// Setting up Home ('/') route
app.get('/',function(req,res){
  Post.find({},function(err,foundPosts){
    if(!err){
      res.render('home',{
        homeStartingText: homeStartingContent,
        postsArray: foundPosts});
    }
    else{
      console.log(err);
    }
  });
});

// Setting up '/about' route
app.get('/about',function(req,res){
  res.render('about',{aboutText: aboutContent});
});

// Setting up '/contact' route
app.get('/contact',function(req,res){
  res.render('contact',{contactText: contactContent});
});

// Setting up '/compose' route
app.get('/compose',function(req,res){
  res.render('compose');
});

// Setting up the 'post' request
app.post('/compose',function(req,res){
  const post = new Post({ // creating post object to be added to the database
    title: req.body.newEntryTitle,
    body: req.body.newEntryBody,
  });
  post.save(function(err){ // Saving the post to the database
    if(!err){
      res.redirect('/'); // redirects to the 'home' route
    }
  });
});

// Setting up the 'posts' route with route parameters
app.get('/posts/:postId',function(req,res){
  const urlParameter = req.params.postId;

  Post.findById(urlParameter,function(err,post){
    res.render('post',{post: post});
  });
});




// Setting up Port Listener
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
