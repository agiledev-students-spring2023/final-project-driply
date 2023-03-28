require("dotenv").config({ silent: true });
const express = require("express");
const axios = require("axios")
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");

// Set up Express app
const app = express();
app.use(morgan("dev", { skip: (req, res) => process.env.NODE_ENV === "test" }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

app.post("/post-form", upload.single("image"), (req, res) => {
  if (req.file) {
    const data = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.file.filename,
    };
    res.json(data);
  } else throw "error";
});

app.get("/getPost", (req, res) => {
  console.log("get post with id " + req.body.postId);

  axios
    .get("https://my.api.mockaroo.com/post.json?key=9e339cc0")
    .then(apiResponse => {
      const body = {
        message: "success",
        username: apiResponse.username,
        description: apiResponse.description,
        price: apiResponse.price
      }
      res.json(body);
    })
    .catch(err => next(err))
})

app.post("/like", (req, res) => {
  console.log("like post with id " + req.body.postId);
  const body = {
    message: "success"
  }

  res.json(body);
})

app.post("/unlike", (req, res) => {
  console.log("unlike post with id " + req.body.postId);
  const body = {
    message: "success"
  }

  res.json(body);
})

app.post('/createComment', (req, res) =>{
  console.log("commenting on post with id " + req.body.postId + " by user " + req.body.user);
  const body = {
    message: "success"
  }

  res.json(body);
})


module.exports = app;
