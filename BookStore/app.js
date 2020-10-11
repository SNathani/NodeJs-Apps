const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 2020;

// Connet to database selectively
if (process.env.ENV === 'Test') {
  console.log('Connecting to INTEGRATION Tests Database ...');
  const db = mongoose.connect('mongodb://localhost/bookAPI_Tests');
} else {
  console.log('Connecting to PRODUCTION Database ...');
  const db = mongoose.connect('mongodb://localhost/bookAPI');
}

const Book = require('./models/bookModel');

const bookRouter = require('./routes/bookRouter')(Book);

app.use(bodyParser.urlencoded({ encoded: true }));
app.use(bodyParser.json());

app.use('/api', bookRouter);

app.get('/', (request, response) => {
  response.send('Welcome to REST API');
});

app.server = app.listen(port, () => {
  console.log(`REST API Running on Port ${port}`);
});

module.exports = app;