require("dotenv").config({ silent: true });
const express = require("express");
const axios = require("axios");
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

app.get("/getPost", (req, res, next) => {
  console.log("get post with id " + req.body.postId);

  axios
    .get("https://my.api.mockaroo.com/post.json?key=9e339cc0")
    .then((apiResponse) => {
      firstRandomPost = apiResponse.data[0];
      const body = {
        message: "success",
        username: firstRandomPost.username,
        description: firstRandomPost.description,
        price: firstRandomPost.price,
      };
      res.json(body);
    })
    .catch((err) => next(err));
});

app.post("/like", (req, res, next) => {
  console.log("like post with id " + req.body.postId);

  axios
    .get("https://my.api.mockaroo.com/post.json?key=9e339cc0")
    .then((apiResponse) => {
      firstRandomPost = apiResponse.data[0];
      const body = {
        likes: firstRandomPost.likes + 1,
        message: "success",
      };
      res.json(body);
    })
    .catch((err) => next(err));
});

app.post("/unlike", (req, res, next) => {
  console.log("unlike post with id " + req.body.postId);
  const body = {
    message: "success",
  };

  res.json(body);
});

app.post("/createComment", (req, res, next) => {
  console.log(
    "commenting on post with id " +
      req.body.postId +
      " by user " +
      req.body.user
  );
  const body = {
    message: "success",
  };

  res.json(body);
});

app.get("/bookmarks", async (req, res) => {
  axios
    .get("https://my.api.mockaroo.com/bookmark_schema.json?key=90e03700")
    .then((apiResponse) => {
      const { data, status } = apiResponse;
      res.json({ data, status });
    })
    .catch((err) => {
      res.json({ error: err.message, status: err.response.status });
    });
});

app.get("/chats", async (req, res) => {
  axios
    .get("https://my.api.mockaroo.com/users_chats.json?key=90e03700")
    .then((apiResponse) => {
      const { data, status } = apiResponse;
      res.json({ data, status });
    })
    .catch((err) => {
      res.json({ error: err.message, status: err.response.status });
    });
});

app.get("/following", async (req, res) => {
  axios
    .get("https://my.api.mockaroo.com/following_schema.json?key=90e03700")
    .then((apiResponse) => {
      const { data, status } = apiResponse;
      res.json({ data, status });
    })
    .catch((err) => {
      res.json({ error: err.message, status: err.response.status });
    });
});

module.exports = app;
