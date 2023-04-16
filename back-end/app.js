require("dotenv").config({ silent: true });
const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser")
const path = require("path");
const Post = require("./models/Post.js")
const User = require("./models/User.js")
const Comment = require("./models/Comment.js")

const jwt = require("jsonwebtoken")
const passport = require("passport")

// use this JWT strategy within passport for authentication handling
const jwtStrategy = require("./config/jwt-config.js") // import setup options for using JWT in passport
passport.use(jwtStrategy)

mongoose.connect('mongodb+srv://' + process.env.MONGO_USERNAME + ':' + process.env.MONGO_PASSWORD + '@driply.rdngwwf.mongodb.net/driply?retryWrites=true&w=majority');

// Set up Express app
const app = express();

// tell express to use passport middleware
app.use(passport.initialize())

app.use(morgan("dev", { skip: (req, res) => process.env.NODE_ENV === "test" }));
app.use(cookieParser())
app.use(cors({ origin: process.env.FRONT_END_DOMAIN, credentials: true }))
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
    const newPost = new Post({
      user: new mongoose.Types.ObjectId(req.body.userid),
      image: req.file.filename,
      description: req.body.description,
      price: req.body.price,
      comments: [],
      likes: []
    });
    newPost.save().then((savedImg) => {
      res.json({ message: "success"});
    }).catch(err => {
      res.json({ message: "Error creating post " + err});
    })
  } else{
    res.json({
      message: "invalid file"
    })
  }
});

app.post("/profile", (req, res, next) => {
  console.log("fetching profile of user with id " + req.body.userId);
  axios
    .get("https://my.api.mockaroo.com/post.json?key=997e9440")
    .then((apiResponse) => {
      firstRandomPost = apiResponse.data[0];

      var own = false;
      // check if logged in user is the one who owns this profile once auth is implemented
      // set own to true if it is

      const body = {
        message: "success",
        username: firstRandomPost.username,
        description: firstRandomPost.description,
        ownProfile: own,
      };
      res.json(body);
    })
    .catch((err) => next(err));
});

app.get("/getPost", (req, res, next) => {
  console.log("get post with id " + req.body.postId);

  axios
    .get("https://my.api.mockaroo.com/post.json?key=997e9440")
    .then((apiResponse) => {
      firstRandomPost = apiResponse.data[0];
      const body = {
        message: "success",
        likes: firstRandomPost.likes,
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
  const id = req.params.postId;
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
    .get("https://my.api.mockaroo.com/post.json?key=997e9440")
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

app.post("/bookmark", (req, res) => {
  console.log(
    "bookmark post with id " +
      req.body.postId +
      " by user " +
      req.body.user
  );
  const body = {
    message: "success",
  };
  res.json(body);
});

app.post("/unbookmark", (req, res) => {
  console.log(
    "unbookmarking post with id " +
      req.body.postId +
      " by user " +
      req.body.user
  );
  const body = {
    message: "success",
  };
  res.json(body);
});

app.get("/getHomePosts", async (req, res) => {
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

app.get("/getTrendingPosts", async (req, res) => {
  Post.find({}).then((posts) => {
    console.log(posts); //process this array later to find the trending posts
    res.json({data: posts});
  }).catch((err) => {
    console.log(err);
  });
});

app.post("/image", async (req, res) => {
  res.sendFile(__dirname + "/public/uploads/" + req.body.filename);
});

app.post("/editProfile", async (req, res) => {
  // api route is receiving a username and password to save but doesn't have to update both.
  // User can just save username or password only

  try {
    console.log(`updating user profile (userId: ${req.body.userId}) `);
    const body = {
      message: "success",
      status: 200,
    };
    res.json(body);
  } catch (error) {
    res.json({ error: error.message, status: 500, });
  }
})

const authenticationRoutes = require("./routes/authRoutes.js")
const cookieRoutes = require("./routes/cookieRoutes.js")
const protectedContentRoutes = require("./routes/protectedContentRoutes.js")

app.use("/auth", authenticationRoutes()) // all requests for /auth/* will be handled by the authenticationRoutes router
app.use("/cookie", cookieRoutes()) // all requests for /cookie/* will be handled by the cookieRoutes router
app.use("/protected", protectedContentRoutes())

module.exports = app;
