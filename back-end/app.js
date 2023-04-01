require("dotenv").config({ silent: true });
const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");

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

app.post("/profile", (req, res, next) => {
  console.log("fetching profile of user with id " + req.body.userId);
  axios
    .get("https://my.api.mockaroo.com/post.json?key=9e339cc0")
    .then((apiResponse) => {
      firstRandomPost = apiResponse.data[0];
      
      var own = false;
      // check if logged in user is the one who owns this profile once auth is implemented
      // set own to true if it is


      const body = {
        message: "success",
        username: firstRandomPost.username,
        description: firstRandomPost.description,
        ownProfile: own
      };
      res.json(body);
    })
    .catch((err) => next(err));
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

app.post("/like/:postID", (req, res) => {
  const id = req.params.postID;
  // TODO: Find post in database based on postId
  // TODO: update post in database to mark it as liked by the user
  const data = {
    success: true,
  };
  res.json(data);
});

app.post("/unlike/:postId", (req, res) => {
  const postId = req.params.postId;
  // TODO: Find post in database based on postId
  // TODO: update post in database to mark it as unliked by the user
  const data = {
    success: true,
  };
  res.json(data);
});

app.get("/fetchComment", (req, res, next) => {
  console.log("creating new comment " + req.body.comment);
  axios
    .get("https://my.api.mockaroo.com/post.json?key=9e339cc0")
    .then((apiResponse) => {
      firstRandomPost = apiResponse.data[0];
      const body = {
        message: "success",
        username: firstRandomPost.username,
        comments: firstRandomPost.comments,
      };
      res.json(body);
    })
    .catch((err) => next(err));
});

app.post("/createComment", (req, res) => {
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

app.get("/follower", async (req, res) => {
  axios
    .get("https://my.api.mockaroo.com/follower_schema.json?key=90e03700")
    .then((apiResponse) => {
      const { data, status } = apiResponse;
      res.json({ data, status });
    })
    .catch((err) => {
      res.json({ error: err.message, status: err.response.status });
    });
});

app.get("/getAllPosts", async (req, res) => {
  axios
    .get("https://my.api.mockaroo.com/post.json?key=e833d640")
    .then((apiResponse) => {
      const { data } = apiResponse;
      res.json({ data });
    })
    .catch((err) => {
      res.json({ error: err.message, status: err.response.status });
    });
});

module.exports = app;
