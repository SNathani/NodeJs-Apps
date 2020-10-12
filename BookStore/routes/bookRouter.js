const express = require('express');
const booksController = require('../controllers/booksController');

function routes(Book) {
  const bookRouter = express.Router();
  const controller = booksController(Book);

  bookRouter.route('/books')

    //POST ------------- ------------ ------------- ------------
    .post(controller.post)
    //GET ------------- ------------ ------------- ------------
    .get(controller.get);

  //Middleware to avoid repeating ourselves  
  bookRouter.use('/books/:bookId', (req, res, next) => {
    Book.findById(req.params.bookId, (err, book) => {
      if (err) {
        return res.send(err);
      }
      //Check if book is available, pass it with the request
      if (book) {
        req.book = book;
        return next();
      }
      return res.sendStatus(404);
    });
  });

  bookRouter.route('/books/:bookId')
    .get((req, res) => {
      const host = req.headers.host;
      const model = req.book;
      const newBook = model.toJSON();

      newBook._links = {};
      const genre = model.genre.replace(' ', '%20');
      newBook._links.genre =`http://${host}/api/books/?genre=${genre}`; 
      newBook._links.all =`http://${host}/api/books/`; 

      //return modified book
      res.json(newBook)
    })
    .put((req, res) => {
      const { book } = req;
      //update entity
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;
      //save
      req.book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    .patch((req, res) => {
      const { book } = req;
      //can't change _id, so when tried remove the property
      if (req.body._id) {
        delete req.body._id;
      }
      //update entity only provided
      Object.entries(req.body).forEach(item => {
        const key = item[0];
        const value = item[1];
        book[key] = value;
      });

      //save
      req.book.save((err) => {
        if (err) {
          return res.send(err);
        }
        return res.json(book);
      });
    })
    .delete((req, res) => {
      req.book.remove((err) => {
        if (err) {
          return res.send(err);
        }
        //removed
        return res.sendStatus(204);
      });
    });

  return bookRouter;
}

module.exports = routes;