const should = require('should');
const sinon = require('sinon');
const bookController = require('../controllers/booksController');

describe('UNIT TEST - Book Controller Tests:', () => {
  describe('Post Tests:', () => {
    it('should not allow an empty title on post', () => {
      //mock Book object
      const Book = function (book) { this.save = () => { } };

      const req = {
        body: {
          author: 'John'
        }
      };
      //mock response
      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      //act
      const controller = bookController(Book);
      controller.post(req, res);
      //assert
      res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.send.calledWith('Title is required').should.equal(true);
    });
  });
});