var cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");

const options = { useNewUrlParser: true };
const User = require("./models/user");
const Video = require("./models/video")

mongoose
  .connect(
    "mongodb://adil_maqusood:0xxnD89VEKwtLOG2@mywebsite-shard-00-00-kbpga.mongodb.net:27017,mywebsite-shard-00-01-kbpga.mongodb.net:27017,mywebsite-shard-00-02-kbpga.mongodb.net:27017/test?ssl=true&replicaSet=mywebsite-shard-0&authSource=admin&retryWrites=true",
    options
  )
  .then(() => {
    console.log("Connected");
  })
  .catch(error => {
    console.log(error);
  });

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.get("/test", (req, res, next) => {
  res.status(200).send("WORKING");
});

app.get("/isAuthenticated",(req, res, next) => {
  User.findById(req.query.id,function(error,response){
    if(response){
      res.status(200).json({message: "Authenticated"})
    }
    else{
      res.status(404).json({message: "Not Authenticated"});
    }
  });
});

app.post("/login",(req,res,next)=>{
  User.findOne({"user.email":req.body.email}, (error,response)=>{
    if(error){
      res.status(404).json({
        message: "Invalid Credentials"
      });
    }
    else if(response && response.user.password == req.body.password){
      res.status(200).json({
        message: "Authenticated",
        id: response._id,
        name:response.user.name
      });
    }
    else{
      res.status(404).json({
        message: "Invalid Credentials"
      });
    }
  });
});

app.post("/register", (req,res,next) => {
  User.find({"user.email": req.body.email}).then(documents=>{
    console.log(documents);
    if(documents.length==0){
      const user = new User({
        user : req.body
      });
      user.save();
      res.status(200).json({
        message: "Registered"
      });
    }
    else{
      res.status(404).json({
        message: "Already registered"
      });
    }
  });
});

app.post("/addVideo", (req,res,next)=>{
  const video = new Video({
    userId : req.query.id,
    video: req.body
  });
  video.save();
  res.status(200).json({
    message: "Video added to Library"
  });
});

app.get("/getVideos", (req,res,next)=>{
  Video.find({"userId": req.query.id}).then(documents=>{
    res.status(200).json(documents);
  })
})

app.use(cors());
module.exports = app;
