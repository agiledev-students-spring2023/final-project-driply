process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);


describe("GET request to /getHomePosts route", () => {
    it("it should respond with an HTTP 200 status code and an object in the response body", done => {
      chai
        .request(server)
        .get("/getHomePosts")
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a("object")
          res.body.should.have.property("data")
          res.body.data.should.be.an("array")
          done()
        })
    })
})