process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);


describe("GET request to /foo route", () => {
    it("it should respond with an HTTP 200 status code and an object in the response body", done => {
      chai
        .request(server)
        .get("/foo")
        .end((err, res) => {
          res.should.have.status(200) // use should to make BDD-style assertions
          res.body.should.be.a("object") // our route sends back an object
          res.body.should.have.property("success", true) // a way to check the exact value of a property of the response object
          done() // resolve the Promise that these tests create so mocha can move on
        })
    })
})