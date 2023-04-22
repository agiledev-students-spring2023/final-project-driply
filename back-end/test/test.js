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
chai.should();
chai.use(chaiHttp);

describe("/GET request to /getTrendingPosts", () => {
  before((done) => {
    mongoose.connect(
      "mongodb+srv://" +
        process.env.MONGO_USERNAME +
        ":" +
        process.env.MONGO_PASSWORD +
        "@driply.rdngwwf.mongodb.net/driply?retryWrites=true&w=majority"
    );
    done();
  });
  it("should return all trending posts", (done) => {
    chai
      .request(app)
      .get("/getTrendingPosts")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.data).to.be.an("array");
        done();
      });
  });
});

describe("/GET request to /getHomePosts", () => {
  before((done) => {
    mongoose.connect(
      "mongodb+srv://" +
        process.env.MONGO_USERNAME +
        ":" +
        process.env.MONGO_PASSWORD +
        "@driply.rdngwwf.mongodb.net/driply?retryWrites=true&w=majority"
    );
    done();
  });

  it("should return all home posts", (done) => {
    chai
      .request(app)
      .get("/getHomePosts")
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body.data).to.be.an("array");
        done();
      });
  });
});

describe("/GET request to /follower/:id", () => {
  let user;

  before(async () => {
    await mongoose.connect(
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

  it("should return follower info for a valid user ID", (done) => {
    // create a user to test with
    user = new User({
      name: "Test User",
      followers: ["123456789012345678901234", "234567890123456789012345"],
    });
    user.save();

    chai
      .request(app)
      .get(`/follower/${user._id}`)
      .end((err, res) => {
        res.should.have.status(200);
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
      .end((err, res) => {
        res.should.have.status(500);
        res.body.success.should.be.false;
        res.body.message.should.equal("Error looking up user in database.");
        done();
      });
  });

  after(async () => {
    await User.deleteOne({ _id: user.id });
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

// describe("GET request to /following route", () => {
//   let axiosGetStub;

//   beforeEach(() => {
//     axiosGetStub = sinon.stub(axios, "get");
//   });

//   afterEach(() => {
//     axiosGetStub.restore();
//   });

//   it("should return an array of following data with 200 status code", (done) => {
//     const mockData = [
//       { id: 1, user: "testuser1", following: "testuser2" },
//       { id: 2, user: "testuser1", following: "testuser3" },
//     ];

//     axiosGetStub.resolves({
//       data: mockData,
//       status: 200,
//     });

//     request(server)
//       .get("/following")
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         expect(res.body).to.be.an("object");
//         expect(res.body).to.have.property("data");
//         expect(res.body.data).to.deep.equal(mockData);
//         expect(res.body).to.have.property("status", 200);
//         done();
//       });
//   });

//   it("should return an error message and status code when API is down", (done) => {
//     const errorMessage = "API is down";

//     axiosGetStub.rejects({
//       message: errorMessage,
//       response: { status: 500 },
//     });

//     request(server)
//       .get("/following")
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         expect(res.body).to.be.an("object");
//         expect(res.body).to.have.property("error", errorMessage);
//         expect(res.body).to.have.property("status", 500);
//         done();
//       });
//   });
// });

// describe("GET request to /follower route", () => {
//   let axiosGetStub;

//   beforeEach(() => {
//     axiosGetStub = sinon.stub(axios, "get");
//   });

//   afterEach(() => {
//     axiosGetStub.restore();
//   });

//   it("should return an array of following data with 200 status code", (done) => {
//     const mockData = [
//       { id: 1, user: "testuser1", following: "testuser2" },
//       { id: 2, user: "testuser1", following: "testuser3" },
//     ];

//     axiosGetStub.resolves({
//       data: mockData,
//       status: 200,
//     });

//     request(server)
//       .get("/follower")
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         expect(res.body).to.be.an("object");
//         expect(res.body).to.have.property("data");
//         expect(res.body.data).to.deep.equal(mockData);
//         expect(res.body).to.have.property("status", 200);
//         done();
//       });
//   });

//   it("should return an error message and status code when API is down", (done) => {
//     const errorMessage = "API is down";

//     axiosGetStub.rejects({
//       message: errorMessage,
//       response: { status: 500 },
//     });

//     request(server)
//       .get("/follower")
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         expect(res.body).to.be.an("object");
//         expect(res.body).to.have.property("error", errorMessage);
//         expect(res.body).to.have.property("status", 500);
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

// describe("GET request to /bookmarks route", () => {
//   let axiosGetStub;

//   beforeEach(() => {
//     axiosGetStub = sinon.stub(axios, "get");
//   });

//   afterEach(() => {
//     axiosGetStub.restore();
//   });

//   it("should return bookmark data with a 200 status code", (done) => {
//     axiosGetStub.resolves({
//       data: [
//         { id: 1, title: "Bookmark 1", url: "https://examplebm.com/1" },
//         { id: 2, title: "Bookmark 2", url: "https://examplebm.com/2" },
//         { id: 3, title: "Bookmark 3", url: "https://examplebm.com/3" },
//       ],
//       status: 200,
//     });

//     request(server)
//       .get("/bookmarks")
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         assert.deepStrictEqual(res.body, {
//           data: [
//             { id: 1, title: "Bookmark 1", url: "https://examplebm.com/1" },
//             { id: 2, title: "Bookmark 2", url: "https://examplebm.com/2" },
//             { id: 3, title: "Bookmark 3", url: "https://examplebm.com/3" },
//           ],
//           status: 200,
//         });
//         done();
//       });
//   });

//   it("should handle errors with an error message and status code", (done) => {
//     // Create a stub for the axios.get method that rejects with an error
//     axiosGetStub.rejects({
//       message: "API is down",
//       response: { status: 500 },
//     });

//     request(server)
//       .get("/bookmarks")
//       .expect(200)
//       .end((err, res) => {
//         if (err) return done(err);
//         assert.deepStrictEqual(res.body, {
//           error: "API is down",
//           status: 500,
//         });
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
