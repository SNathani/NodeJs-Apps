const express = require('express');
const mongoose = require('mongoose');

const app = express();
const db = mongoose.connect('mongodb://localhost/bookAPI');
const bookRouter = express.Router();
const port = process.env.PORT || 2020;
const Book = require('./models/bookModel');

bookRouter.route('/books')
  .get((req, res) => {

    Book.find((err, books) => {
      if (err) {
        return res.send(err);
      }

      return res.json(books);
    });

  });

app.use('/api', bookRouter);

app.get('/', (request, response) => {
  response.send('Welcome to REST API');
});

app.listen(port, () => {
  console.log(`REST API Running on Port ${port}`);
});