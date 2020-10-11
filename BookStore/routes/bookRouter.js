const express = require('express');

function routes(Book) {
  const bookRouter = express.Router();

  bookRouter.route('/books')

    //POST ------------- ------------ ------------- ------------
    .post((req, res) => {
      const book = new Book(req.body);
      book.save();
      console.log(book);

      return res.status(201).json(book);
    })
    //GET ------------- ------------ ------------- ------------
    .get((req, res) => {
      //const {query} = req;
      const query = {};

      if (req.query.genre) {
        query.genre = req.query.genre;
      }

      Book.find(query, (err, books) => {
        if (err) {
          return res.send(err);
        }
        return res.json(books);
      });

    });

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
    .get((req, res) => res.json(req.book))
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