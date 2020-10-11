require('should');

process.env.ENV = 'Test';

const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');

const Book = mongoose.model('Book');

const agent = request.agent(app);

describe('INTEGRATION TESTS - Book CRUD Tests', () => {
  it('should allow a book to be posted and return read and _id', (done) => {
    const bookPost = {
      title: 'My Book',
      author: 'New Author',
      genere: 'Sales'
    };

    agent.post('/api/books')
      .send(bookPost)
      .expect(200)
      .end((err, results) => {
        console.log(results.body);
        results.body.read.should.equal(false);
        results.body.should.have.property('_id');
        done();
      });
  });

  //cleanup
  afterEach((done) => {
    Book.deleteMany({}).exec();
    done();
  });

  //finally - close connections and stop listening
  after((done)=>{
    console.log("Closing the DB Connection ...");
    mongoose.connection.close();

    console.log("Stopping the applicaiton ...");
    app.server.close(done());
  });
});