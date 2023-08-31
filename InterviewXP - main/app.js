// require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const _ = require('lodash')

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/InterviewDB');

const postSchema = {
  postTitle: String,
  dateGiven: Date,
  postBody: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", (req,res) => {
  res.render("home.ejs")
})

app.get("/secrets", (req,res) => {
  Post.find({}, function(err, posts){
   res.render("main", {
     secrets: posts
    });
 })
})

app.get("/secrets/:secretsBrief", (req,res) =>{
  const reqTitle = _.lowerCase(req.params.secretsBrief);
  console.log(reqTitle)

  Post.findOne(function(err, post){
    res.render("secret", { 
      secret:
      {
        storedTitle : reqTitle,
        storedDetails : post.postBody
      }
    });
  });

  // async function getPostById(postId) {
  //   try {
  //     const post = await Post.findById(postId);
  //     if (!post) {
  //       console.log('Post not found');
  //       return;
  //     }
  //     console.log('Post Title:', post.postTitle);
  //     // Handle other properties...
  //   } catch (error) {
  //     console.error('Error fetching post:', error.message);
  //   }
  // }

})

app.get("/compose", (req,res) => {
  res.render("compose.ejs")
})

app.post("/compose", (req,res) =>{
  var userData =
  {
    postTitle : req.body.postTitle,
    dateGiven : req.body.dateGiven,
    postBody : req.body.postBody
  };

  // secrets.push(userData);
  var post = new Post(userData)
  post.save();
  res.redirect('/secrets');
})

app.get("/main", (req,res) =>
{
  res.render("main");
})

app.listen(8000, ()=>{
    console.log("App started at the port 8000");
});