require("dotenv").config({ silent: true });
const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const Post = require("./models/Post.js");
const User = require("./models/User.js");
const Comment = require("./models/Comment.js");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const passport = require("passport");

// use this JWT strategy within passport for authentication handling
const jwtStrategy = require("./config/jwt-config.js"); // import setup options for using JWT in passport
passport.use(jwtStrategy);

mongoose.connect(
  "mongodb+srv://" +
    process.env.MONGO_USERNAME +
    ":" +
    process.env.MONGO_PASSWORD +
    "@driply.rdngwwf.mongodb.net/driply?retryWrites=true&w=majority"
);

// Set up Express app
const app = express();

// tell express to use passport middleware
app.use(passport.initialize());

app.use(morgan("dev", { skip: (req, res) => process.env.NODE_ENV === "test" }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONT_END_DOMAIN, credentials: true }));
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
    User.findOne({ name: req.body.user })
      .then((u) => {
        const newPost = new Post({
          user: u._id,
          image: req.file.filename,
          description: req.body.description,
          price: req.body.price,
          comments: [],
          likes: [],
          bookmarked: false,
        });
        newPost
          .save()
          .then((savedImg) => {
            res.json({ message: "success" });
          })
          .catch((err) => {
            res.json({ message: "Error creating post " + err });
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.json({
      message: "invalid file",
    });
  }
});

app.post("/changePfp", upload.single("image"), (req, res) => {
  User.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(req.body.userId) },
    { profilepic: req.file.filename },
    { new: true }
  )
    .then((u) => {
      Comment.updateMany(
        { user: new mongoose.Types.ObjectId(req.body.userId) },
        { profilepic: req.file.filename }
      ).then((c) => {
        res.json({ message: "success" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/profile", async (req, res, next) => {
  console.log("fetching profile of user with id " + req.body.userId);
  // find user in db
  try {
    const user = await User.findOne({ _id: req.body.userId }).exec();
    // check if user was found
    if (!user) {
      console.error("User was not found");
      return res.status(401).json({
        success: false,
        message: "User was not found in db",
      });
    }

    const allPosts = await Post.find({ user: req.body.userId })
      .populate("user")
      .exec();
    // send user data if user exists
    const { _id, name, posts, followers, following, profilepic } = user;

    if (!allPosts) {
      return res.json({
        success: false,
        message: "err fetching user's posts",
      });
    }

    res.json({
      success: true,
      data: {
        id: _id,
        name,
        posts,
        followers,
        following,
        allPosts,
        profilepic,
      },
    });
  } catch (error) {
    console.log(`Err looking up user: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error looking up user in database.",
      error: error,
    });
  }
});

app.post("/getPost", (req, res, next) => {
  Post.findById(new mongoose.Types.ObjectId(req.body.postId))
    .then((p) => {
      User.findById(p.user)
        .then((u) => {
          res.json({
            username: u.name,
            description: p.description,
            price: p.price,
            likes: p.likes,
            image: p.image,
            pfp: u.profilepic,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/like/:postId", (req, res) => {
  const id = req.params.postId;
  Post.findById(new mongoose.Types.ObjectId(id))
    .then((p) => {
      let isInArray = p.likes.some(function (element) {
        return element.equals(req.body.userId);
      });

      if (!isInArray) {
        p.likes.push(new mongoose.Types.ObjectId(req.body.userId));
        p.save();
      }
      const data = {
        success: true,
      };
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/unlike/:postId", (req, res) => {
  const id = req.params.postId;
  Post.findById(new mongoose.Types.ObjectId(id))
    .then((p) => {
      let isInArray = p.likes.some(function (element) {
        return element.equals(req.body.userId);
      });
      //console.log(isInArray);
      if (isInArray) {
        p.likes.pull(new mongoose.Types.ObjectId(req.body.userId));
        p.save();
      }
      const data = {
        success: true,
      };
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/fetchComment", (req, res, next) => {
  Post.findById(new mongoose.Types.ObjectId(req.body.postId))
    .populate({ path: "comments", populate: { path: "user" } })
    .then((p) => {
      const body = {
        message: "success",
        comments: p.comments,
      };
      res.json(body);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/createComment", (req, res) => {
  Post.findById(new mongoose.Types.ObjectId(req.body.postId))
    .then((p) => {
      User.findById(new mongoose.Types.ObjectId(req.body.userId))
        .then((u) => {
          const newComment = new Comment({
            user: new mongoose.Types.ObjectId(req.body.userId),
            content: req.body.comment,
            post: new mongoose.Types.ObjectId(req.body.postId),
            profilepic: u.profilepic,
          });
          newComment
            .save()
            .then((savedComment) => {
              p.comments.push(new mongoose.Types.ObjectId(savedComment._id));
              p.save();
              console.log(savedComment);
              res.json({ message: "success", newComment: savedComment });
            })
            .catch((err) => {
              res.json({ message: "Error creating comment " + err });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/bookmarks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.find({ _id: id }).populate("bookmark").exec();
    // check if user was found
    if (!user[0]) {
      console.error("User was not found");
      return res.status(401).json({
        success: false,
        message: "User was not found in db",
      });
    }
    // send user data if user exists
    const { bookmark } = user[0];
    res.json({
      success: true,
      bookmarks: bookmark,
    });
  } catch (error) {
    console.log(`Err looking up user: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error looking up user in database.",
      error: error,
    });
  }
});

app.post("/bookmark", async (req, res) => {
  try {
    const p = await Post.findOne(
      new mongoose.Types.ObjectId(req.body.postID)
    ).exec();
    if (!p) {
      console.error("Post was not found");
      return res.status(401).json({
        success: false,
        message: "Post was not found in db",
      });
    }

    const u = await User.findOne({ _id: req.body.userID }).exec();
    // update bookmark array
    u.bookmark.push(new mongoose.Types.ObjectId(req.body.postID));
    u.save();
    if (!u) {
      console.error("User was not found");
      return res.status(401).json({
        success: false,
        message: "User was not found in db",
      });
    }

    // update post bookmarked field to true
    p.bookmarked = true;
    p.save();

    const body = {
      success: true,
      message: "success",
    };
    res.json(body);
  } catch (error) {
    console.log(`Err looking up user: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error looking up user in database.",
      error: error,
    });
  }
});

app.post("/unbookmark", async (req, res) => {
  try {
    const p = await Post.findOne(
      new mongoose.Types.ObjectId(req.body.postID)
    ).exec();
    if (!p) {
      console.error("Post was not found");
      return res.status(401).json({
        success: false,
        message: "Post was not found in db",
      });
    }

    const u = await User.findOne({ _id: req.body.userID }).exec();
    // update bookmark array
    u.bookmark.pull(new mongoose.Types.ObjectId(req.body.postID));
    u.save();
    if (!u) {
      console.error("User was not found");
      return res.status(401).json({
        success: false,
        message: "User was not found in db",
      });
    }

    p.bookmarked = false;
    p.save();

    const body = {
      success: true,
      message: "success",
    };
    res.json(body);
  } catch (error) {
    console.log(`Err looking up user: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error looking up user in database.",
      error: error,
    });
  }
});

app.get("/getHomePosts", async (req, res) => {
  Post.find({})
    .then((posts) => {
      //console.log(posts); //process this array later to find the trending posts
      res.json({ data: posts });
    })
    .catch((err) => {
      console.log(err);
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

app.get("/follower/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id }).exec();
    // check if user was found
    if (!user) {
      console.error("User was not found");
      return res.status(401).json({
        success: false,
        message: "User was not found in db",
      });
    }
    const followerIDs = user.followers.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const followerUsers = await User.find({
      _id: { $in: followerIDs },
    }).exec();
    const followerInfo = followerUsers.map((u) => {
      return {
        id: u._id,
        name: u.name,
        profilePic: u.profilepic,
      };
    });
    // send user data if user exists
    const { followers } = user;
    res.json({
      success: true,
      followers: followers,
      followersData: followerInfo,
    });
  } catch (error) {
    console.log(`Err looking up user: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error looking up user in database.",
      error: error,
    });
  }
});

app.get("/following/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id }).exec();
    // check if user was found
    if (!user) {
      console.error("User was not found");
      return res.status(401).json({
        success: false,
        message: "User was not found in db",
      });
    }
    const followingIDs = user.following.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const followingUsers = await User.find({
      _id: { $in: followingIDs },
    }).exec();
    const followingInfo = followingUsers.map((u) => {
      return {
        id: u._id,
        name: u.name,
        profilePic: u.profilepic,
      };
    });
    // send user data if user exists
    const { following } = user;
    res.status(200).json({
      success: true,
      message: "User following info retrieved successfully",
      following: following,
      followingData: followingInfo,
    });
  } catch (error) {
    console.log(`Err looking up user: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error looking up user in database.",
      error: error,
    });
  }
});

app.post("/follow", async (req, res) => {
  try {
    const u = await User.findOne({ _id: req.body.userID }).exec();
    // update following array
    u.following.push(new mongoose.Types.ObjectId(req.body.followedID));
    u.save();
    if (!u) {
      console.error("User was not found");
      return res.status(401).json({
        success: false,
        message: "User was not found in db",
      });
    }

    const f = await User.findOne({ _id: req.body.followedID }).exec();
    // update follower array
    f.followers.push(new mongoose.Types.ObjectId(req.body.userID));
    f.save();
    if (!f) {
      console.error("User was not found");
      return res.status(401).json({
        success: false,
        message: "User was not found in db",
      });
    }
    const body = {
      success: true,
      message: "success",
    };
    res.json(body);
  } catch (error) {
    console.log(`Err looking up user: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error looking up user in database.",
      error: error,
    });
  }
});

app.post("/unfollow", async (req, res) => {
  try {
    const u = await User.findOne({ _id: req.body.userID }).exec();
    // update following array
    u.following.pull(new mongoose.Types.ObjectId(req.body.followedID));
    u.save();
    if (!u) {
      console.error("User was not found");
      return res.status(401).json({
        success: false,
        message: "User was not found in db",
      });
    }

    const f = await User.findOne({ _id: req.body.followedID }).exec();
    // update follower array
    f.followers.pull(new mongoose.Types.ObjectId(req.body.userID));
    f.save();
    if (!f) {
      console.error("User was not found");
      return res.status(401).json({
        success: false,
        message: "User was not found in db",
      });
    }
    const body = {
      success: true,
      message: "success",
    };
    res.json(body);
  } catch (error) {
    console.log(`Err looking up user: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Error looking up user in database.",
      error: error,
    });
  }
});

app.get("/getTrendingPosts", async (req, res) => {
  Post.find({})
    .then((posts) => {
      //console.log(posts); //process this array later to find the trending posts
      res.json({ data: posts });
    })
    .catch((err) => {
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
    const { userId } = req.body;

    const update = {};
    if (req.body.name) {
      update.name = req.body.name;
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      update.password = hash;
    }
    const user = await User.findOneAndUpdate({ _id: userId }, update, {
      new: true,
    });
    const token = user.generateJWT();
    return res.json({
      success: true,
      message: "Updated user.",
      token: token,
      username: user.name,
      id: user.id,
      profilePic: user.profilepic,
    });
  } catch (error) {
    res.json({
      success: false,
      status: 500,
      message: "Err trying to update your info",
    });
  }
});

app.post("/getUserPfp", (req, res) => {
  User.findById(new mongoose.Types.ObjectId(req.body.userId))
    .then((u) => {
      res.sendFile(__dirname + "/public/uploads/" + u.profilepic);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/getUsername", (req, res) => {
  User.findById(new mongoose.Types.ObjectId(req.body.userId))
    .then((u) => {
      res.json({ username: u.name });
    })
    .catch((err) => {
      console.log(err);
    });
});

const authenticationRoutes = require("./routes/authRoutes.js");
const cookieRoutes = require("./routes/cookieRoutes.js");
const protectedContentRoutes = require("./routes/protectedContentRoutes.js");
const { error } = require("console");

app.use("/auth", authenticationRoutes()); // all requests for /auth/* will be handled by the authenticationRoutes router
app.use("/cookie", cookieRoutes()); // all requests for /cookie/* will be handled by the cookieRoutes router
app.use("/protected", protectedContentRoutes());

module.exports = app;
