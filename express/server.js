"use strict";
const express = require("express");
const serverless = require("serverless-http");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("./post-model");
mongoose
  .connect(
    "mongodb+srv://778899:???@cluster0.nmke4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connect to mongodb atlas.");
  })
  .catch((err) => {
    console.log("Fail to connnect....db");
  });

app.use(bodyParser.json());
app.use("/.netlify/functions/server", router); // path must route to lambda
app.use("/", router);

router.get("/", (req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Up and running</h1>");
  res.end();
});

router.get("/post", async (req, res) => {
  let postFound = await Post.find({});
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("" + JSON.stringify(postFound));
  res.end();
});

router.post("/post", async (req, res) => {
  let { title, content } = req.body;
  let newPost = new Post({ title, content });
  try {
    await newPost.save();
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("data saved");
    res.end();
  } catch (err) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.write("data not saved");
    res.end();
  }
});

router.patch("/post", async (req, res) => {
  let { title, content, _id } = req.body;
  try {
    await Post.findOneAndUpdate(
      { _id },
      { title, content },
      { new: true },
      (err, doc) => {
        if (err) {
          res.writeHead(400, { "Content-Type": "text/html" });
          res.write("data not updated");
          res.end();
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write("data updated");
          res.end();
        }
      }
    );
  } catch (err) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.write("data not updated");
    res.end();
  }
});

router.delete("/post", async (req, res) => {
  let { _id } = req.body;
  try {
    await Post.findOneAndDelete({ _id });
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("data deleted");
    res.end();
  } catch (err) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.write("data not deleted");
    res.end();
  }
});

module.exports = app;
module.exports.handler = serverless(app);
