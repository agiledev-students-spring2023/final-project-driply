process.env.NODE_ENV = "test";
require("dotenv").config({ silent: true });

const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const mongoose = require("mongoose");
const fs = require("fs");
const expect = chai.expect;
const path = require("path");
const request = require("supertest");
const axios = require("axios");
const assert = require("assert");
const sinon = require("sinon");
const Post = require("../models/Post.js");
const User = require("../models/User.js");
const Comment = require("../models/Comment.js");

const should = chai.should();
chai.use(chaiHttp);

before(async () => {
  mongoose.connect(
    "mongodb+srv://" +
      process.env.MONGO_USERNAME +
      ":" +
      process.env.MONGO_PASSWORD +
      "@driply.rdngwwf.mongodb.net/driply?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
});

describe("/GET request to /getTrendingPosts", () => {
  it("should return all trending posts", (done) => {
    chai
      .request(app)
      .get("/getTrendingPosts")
      .timeout(5000)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.data).to.be.an("array");
        done();
      });
  });
});

// describe("/GET request to /getHomePosts", () => {
//   it("should return all home posts", (done) => {
//     chai
//       .request(app)
//       .get("/getHomePosts")
//       .timeout(5000)
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an("object");
//         expect(res.body.data).to.be.an("array");
//         done();
//       });
//   });
// });

describe("/GET request to /follower/:id", () => {
  let user;
  before(async () => {
    // create a user to test with
    user = new User({
      name: "Test User",
      followers: ["123456789012345678901234", "234567890123456789012345"],
    });
    await user.save();
  });

  after(() => {
    User.deleteOne({ _id: user._id }).exec();
  });

  it("should return follower info for a valid user ID", (done) => {
    chai
      .request(app)
      .get(`/follower/${user._id}`)
      .timeout(5000)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.success.should.be.true;
        res.body.followers.should.be.an("array");
        res.body.followersData.should.be.an("array");
        done();
      });
  });

  it("should return a 500 error for an invalid user ID", (done) => {
    chai
      .request(app)
      .get("/follower/invalidID")
      .timeout(5000)
      .end((err, res) => {
        res.should.have.status(500);
        res.should.be.json;
        res.body.success.should.be.false;
        res.body.message.should.equal("Error looking up user in database.");
        done();
      });
  });

  it("should return a 401 error for a user ID that does not exist", (done) => {
    chai
      .request(app)
      .get("/follower/123456789012345678901234")
      .timeout(5000)
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.json;
        res.body.success.should.be.false;
        res.body.message.should.equal("User was not found in db");
        done();
      });
  });
});

describe("/GET request to /following/:id", () => {
  let user;
  before(async () => {
    // create a user to test with
    user = new User({
      name: "Test User",
      following: ["123456789012345678901234", "234567890123456789012345"],
    });
    await user.save();
  });

  after(async () => {
    User.deleteOne({ _id: user._id }).exec();
  });

  it("should return following info for a valid user ID", (done) => {
    chai
      .request(app)
      .get(`/following/${user._id}`)
      .timeout(5000)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.success.should.be.true;
        res.should.be.json;
        res.body.following.should.be.an("array");
        res.body.followingData.should.be.an("array");
        done();
      });
  });

  it("should return a 500 error for an invalid user ID", (done) => {
    chai
      .request(app)
      .get("/following/invalidID")
      .timeout(5000)
      .end((err, res) => {
        res.should.have.status(500);
        res.should.be.json;
        res.body.success.should.be.false;
        res.body.message.should.equal("Error looking up user in database.");
        done();
      });
  });

  it("should return a 401 error for a user ID that does not exist", (done) => {
    chai
      .request(app)
      .get("/follower/123456789012345678901234")
      .timeout(5000)
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.json;
        res.body.success.should.be.false;
        res.body.message.should.equal("User was not found in db");
        done();
      });
  });
});

describe("/GET request to /bookmark/:id", () => {
  let user;
  before(async () => {
    // create a user to test with
    user = new User({
      name: "Test User",
      bookmark: ["123456789012345678901234", "234567890123456789012345"],
    });
    await user.save();
  });

  after(async () => {
    User.deleteOne({ _id: user._id }).exec();
  });

  it("should return bookmark info for a valid user ID", (done) => {
    chai
      .request(app)
      .get(`/bookmarks/${user._id}`)
      .timeout(5000)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.success.should.be.true;
        res.body.bookmarks.should.be.an("array");
        done();
      });
  });

  it("should return a 401 error for a user ID that does not exist", (done) => {
    chai
      .request(app)
      .get("/bookmarks/123456789012345678901234")
      .timeout(5000)
      .end((err, res) => {
        res.should.have.status(401);
        res.should.be.json;
        res.body.success.should.be.false;
        res.body.message.should.equal("User was not found in db");
        done();
      });
  });

  it("should return a 500 error for an invalid user ID", (done) => {
    chai
      .request(app)
      .get("/bookmarks/invalidID")
      .timeout(5000)
      .end((err, res) => {
        res.should.have.status(500);
        res.should.be.json;
        res.body.success.should.be.false;
        res.body.message.should.equal("Error looking up user in database.");
        done();
      });
  });
});

describe("/POST request to /like/:postId", () => {
  let post, user;

  before(async () => {
    // create a user to test with
    user = new User({
      name: "Test User",
    });
    await user.save();
    // create a post to test with
    post = new Post({
      user: "123456789012345678901234",
      image: "testImage",
      description: "testDescription",
      bookmarked: false,
      comments: [],
      likes: [],
    });
    await post.save();
  });

  after(async () => {
    Post.deleteOne({ _id: post._id }).exec();
    User.deleteOne({ _id: user._id }).exec();
  });

  it("should add a new like to a post", (done) => {
    const userId = "123456789012345678901234";
    chai
      .request(app)
      .post(`/like/${post._id}`)
      .send({ userId: userId })
      .timeout(5000)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.success.should.be.true;
        Post.findById(post._id).exec((err, post) => {
          post.likes.should.include(userId);
          done();
        });
      });
  });

  it("should not add a duplicate like to a post", (done) => {
    const userId = "123456789012345678901234";
    post.likes.push(new mongoose.Types.ObjectId(userId));
    post.save((err) => {
      chai
        .request(app)
        .post(`/like/${post._id}`)
        .send({ userId: userId })
        .timeout(5000)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.success.should.be.true;
          Post.findById(post._id).exec((err, post) => {
            const likesCount = post.likes.filter((id) => id === userId).length;
            likesCount.should.equal(1);
            done();
          });
        });
    });
  });

  it("should return a 500 error for an invalid post ID", (done) => {
    chai
      .request(app)
      .post("/like/invalidID")
      .send({ userId: "123456789012345678901234" })
      .timeout(5000)
      .end((err, res) => {
        res.should.have.status(500);
        res.should.be.json;
        res.body.success.should.be.false;
        res.body.message.should.equal("Error looking up post in database.");
        done();
      });
  });
});

// describe("POST request to /profile route", () => {
//   it("it should respond with an HTTP 200 status code and an object in the response body", (done) => {
//     var body = {
//       profileId: 0,
//     };
//     chai
//       .request(server)
//       .post("/profile")
//       .send(body)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a("object");
//         res.body.should.have.property("username");
//         res.body.username.should.be.an("string");
//         res.body.should.have.property("description");
//         res.body.description.should.be.an("string");
//         res.body.should.have.property("ownProfile");
//         res.body.ownProfile.should.be.an("boolean");
//         done();
//       });
//   });
// });

// describe("GET request to /fetchComment route", () => {
//   it("it should respond with an HTTP 200 status code and an object in the response body", (done) => {
//     chai
//       .request(server)
//       .get("/fetchComment")
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a("object");
//         res.body.should.have.property("username");
//         res.body.username.should.be.an("string");
//         res.body.should.have.property("comments");
//         res.body.comments.should.be.an("array");
//         done();
//       });
//   });
// });

// describe("POST request to /createComment route", () => {
//   it("it should respond with an HTTP 200 status code and an object in the response body", (done) => {
//     var body = {
//       newComment: "hello",
//       postId: 0,
//     };
//     chai
//       .request(server)
//       .post("/createComment")
//       .send(body)
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a("object");
//         res.body.should.have.property("message").eql("success");
//         done();
//       });
//   });
// });

// describe("POST request to /post-form route", () => {
//   it("should upload a single file and return its metadata", (done) => {
//     const filePath = __dirname + "/test-image.jpg"; // assuming a test image file is present in the same directory as the test file
//     chai
//       .request(server)
//       .post("/post-form")
//       .attach("image", fs.readFileSync(filePath), "test-image.jpg")
//       .field("name", "Test Product")
//       .field("price", "10.99")
//       .field("description", "This is a test product")
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an("object");
//         expect(res.body).to.have.property("name").that.equals("Test Product");
//         expect(res.body).to.have.property("price").that.equals("10.99");
//         expect(res.body)
//           .to.have.property("description")
//           .that.equals("This is a test product");
//         expect(res.body).to.have.property("image").that.is.a("string");
//         fs.unlinkSync(
//           path.join(__dirname, "../public/uploads", res.body.image)
//         );
//         done();
//       });
//   });

//   it("should throw an error if no file is uploaded", (done) => {
//     chai
//       .request(server)
//       .post("/post-form")
//       .field("name", "Test Product")
//       .field("price", "10.99")
//       .field("description", "This is a test product")
//       .end((err, res) => {
//         expect(res).to.have.status(500);
//         done();
//       });
//   });
// });

// describe("POST request to /like/:postID route", () => {
//   it("should return a success message when a post is liked", (done) => {
//     const postID = "1";
//     chai
//       .request(server)
//       .post(`/like/${postID}`)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an("object");
//         expect(res.body).to.have.property("success").that.equals(true);
//         done();
//       });
//   });
// });

// describe("POST request to /unlike/:postID route", () => {
//   it("should return a success message when a post is liked", (done) => {
//     const postID = "1";
//     chai
//       .request(server)
//       .post(`/unlike/${postID}`)
//       .end((err, res) => {
//         expect(err).to.be.null;
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an("object");
//         expect(res.body).to.have.property("success").that.equals(true);
//         done();
//       });
//   });
// });

// describe("GET request to /getPost route", () => {
//   let axiosGetStub;

//   beforeEach(() => {
//     axiosGetStub = sinon.stub(axios, "get");
//   });

//   afterEach(() => {
//     axiosGetStub.restore();
//   });

//   it("should return a success message with post data", (done) => {
//     // mock the response data for this test
//     axiosGetStub.resolves({
//       data: [
//         {
//           username: "testuser",
//           description: "test description",
//           price: 100,
//         },
//       ],
//     });

//     request(server)
//       .get("/getPost")
//       .send({ postId: "123" })
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         assert.deepStrictEqual(res.body, {
//           message: "success",
//           username: "testuser",
//           description: "test description",
//           price: 100,
//         });
//         done();
//       });
//   });

//   it("should handle errors", (done) => {
//     // create a stub for the axios.get method that rejects with an error
//     axiosGetStub.rejects(new Error("API is down"));

//     request(server)
//       .get("/getPost")
//       .send({ postId: "123" })
//       .expect(500)
//       .end((err, res) => {
//         if (err) return done(err);
//         assert.deepStrictEqual(res.body, {});
//         done();
//       });
//   });
// });

// describe("GET request /chats route", () => {
//   it("should respond with status 200 and a list of chats", (done) => {
//     request(server)
//       .get("/chats")
//       .end((err, res) => {
//         if (err) return done(err);
//         expect(res.statusCode).to.equal(200);
//         expect(res.body).to.be.an("object");
//         expect(res.body).to.have.property("data").that.is.an("array");
//         expect(res.body).to.have.property("status").that.is.a("number");
//         done();
//       });
//   });

//   it("should respond with an error message and status code 500 when the API is down", (done) => {
//     const axiosGetStub = sinon.stub(axios, "get");
//     axiosGetStub.rejects({
//       message: "API is down",
//       response: { status: 500 },
//     });

//     request(server)
//       .get("/chats")
//       .end((err, res) => {
//         axiosGetStub.restore();
//         if (err) return done(err);
//         expect(res.statusCode).to.equal(200);
//         expect(res.body).to.be.an("object");
//         expect(res.body).to.have.property("error").that.equals("API is down");
//         expect(res.body).to.have.property("status").that.equals(500);
//         done();
//       });
//   });
// });

// describe("POST request to /editProfile route", () => {
//   it("should update user profile", (done) => {
//     const userData = {
//       userId: 123,
//       username: "testuser",
//       password: "testpassword",
//     };

//     chai
//       .request(server)
//       .post("/editProfile")
//       .send(userData)
//       .end((err, res) => {
//         chai.expect(res).to.have.status(200);
//         chai.expect(res.body.message).to.equal("success");
//         done();
//       });
//   });

//   it("should return an error with invalid data", (done) => {
//     const invalidData = {
//       username: "testuser",
//     };

//     chai
//       .request(server)
//       .post("/editProfile")
//       .send(invalidData)
//       .end((err, res) => {
//         chai.expect(res).to.have.status(500);
//         chai.expect(res.body.error).to.exist;
//         done();
//       });
//   });
// });

// describe("POST request to /unbookmark", () => {
//   it("should unbookmark a post", (done) => {
//     const data = {
//       user: "testuser",
//       postId: 123,
//     };

//     chai
//       .request(server)
//       .post("/unbookmark")
//       .send(data)
//       .end((err, res) => {
//         chai.expect(res).to.have.status(500);
//         chai.expect(res.body.message).to.equal("success");
//         done();
//       });
//   });
// });

// Close the mongoose connection after all tests are complete
after(async () => {
  await mongoose.connection.close();
});
