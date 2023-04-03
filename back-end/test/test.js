process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();
const fs = require("fs");
const expect = chai.expect;
const path = require("path");
const request = require("supertest");
const axios = require("axios");
const assert = require("assert");
const sinon = require("sinon");

chai.use(chaiHttp);

describe("GET request to /getHomePosts route", () => {
  it("it should respond with an HTTP 200 status code and an object in the response body", (done) => {
    chai
      .request(server)
      .get("/getHomePosts")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("data");
        res.body.data.should.be.an("array");
        done();
      });
  });
});

describe("POST request to /profile route", () => {
  it("it should respond with an HTTP 200 status code and an object in the response body", (done) => {
    var body = {
      profileId: 0,
    };
    chai
      .request(server)
      .post("/profile")
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("username");
        res.body.username.should.be.an("string");
        res.body.should.have.property("description");
        res.body.description.should.be.an("string");
        res.body.should.have.property("ownProfile");
        res.body.ownProfile.should.be.an("boolean");
        done();
      });
  });
});

describe("GET request to /fetchComment route", () => {
  it("it should respond with an HTTP 200 status code and an object in the response body", (done) => {
    chai
      .request(server)
      .get("/fetchComment")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("username");
        res.body.username.should.be.an("string");
        res.body.should.have.property("comments");
        res.body.comments.should.be.an("array");
        done();
      });
  });
});

describe("POST request to /createComment route", () => {
  it("it should respond with an HTTP 200 status code and an object in the response body", (done) => {
    var body = {
      newComment: "hello",
      postId: 0,
    };
    chai
      .request(server)
      .post("/createComment")
      .send(body)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("message").eql("success");
        done();
      });
  });
});

describe("GET request to /following route", () => {
  it("it should respond with an HTTP 200 status code and an object in the response body", (done) => {
    chai
      .request(server)
      .get("/following")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("data");
        res.body.data.should.be.an("array");
        done();
      });
  });
});

describe("GET request to /follower route", () => {
  it("it should respond with an HTTP 200 status code and an object in the response body", (done) => {
    chai
      .request(server)
      .get("/follower")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("data");
        res.body.data.should.be.an("array");
        done();
      });
  });
});

describe("POST request to /post-form route", () => {
  it("should upload a single file and return its metadata", (done) => {
    const filePath = __dirname + "/test-image.jpg"; // assuming a test image file is present in the same directory as the test file
    chai
      .request(server)
      .post("/post-form")
      .attach("image", fs.readFileSync(filePath), "test-image.jpg")
      .field("name", "Test Product")
      .field("price", "10.99")
      .field("description", "This is a test product")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("name").that.equals("Test Product");
        expect(res.body).to.have.property("price").that.equals("10.99");
        expect(res.body)
          .to.have.property("description")
          .that.equals("This is a test product");
        expect(res.body).to.have.property("image").that.is.a("string");
        fs.unlinkSync(
          path.join(__dirname, "../public/uploads", res.body.image)
        );
        done();
      });
  });

  it("should throw an error if no file is uploaded", (done) => {
    chai
      .request(server)
      .post("/post-form")
      .field("name", "Test Product")
      .field("price", "10.99")
      .field("description", "This is a test product")
      .end((err, res) => {
        expect(res).to.have.status(500);
        done();
      });
  });
});

describe("POST request to /like/:postID route", () => {
  it("should return a success message when a post is liked", (done) => {
    const postID = "1"; // set a dummy post ID for testing purposes
    chai
      .request(server)
      .post(`/like/${postID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("success").that.equals(true);
        done();
      });
  });
});

describe("POST request to /unlike/:postID route", () => {
  it("should return a success message when a post is liked", (done) => {
    const postID = "1"; // set a dummy post ID for testing purposes
    chai
      .request(server)
      .post(`/like/${postID}`)
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("success").that.equals(true);
        done();
      });
  });
});

describe("GET request to /getPost route", () => {
  let axiosGetStub;

  beforeEach(() => {
    // create a stub for the axios.get method
    axiosGetStub = sinon.stub(axios, "get");
  });

  afterEach(() => {
    // restore the original axios.get method
    axiosGetStub.restore();
  });

  it("should return a success message with post data", (done) => {
    // mock the response data for this test
    axiosGetStub.resolves({
      data: [
        {
          username: "testuser",
          description: "test description",
          price: 100,
        },
      ],
    });

    request(server)
      .get("/getPost")
      .send({ postId: "123" })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert.deepStrictEqual(res.body, {
          message: "success",
          username: "testuser",
          description: "test description",
          price: 100,
        });
        done();
      });
  });

  it("should handle errors", (done) => {
    // create a stub for the axios.get method that rejects with an error
    axiosGetStub.rejects(new Error("API is down"));

    request(server)
      .get("/getPost")
      .send({ postId: "123" })
      .expect(500)
      .end((err, res) => {
        if (err) return done(err);
        assert.deepStrictEqual(res.body, {});
        done();
      });
  });
});
