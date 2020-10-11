const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const db = mongoose.connect('mongodb://localhost/bookAPI');
const port = process.env.PORT || 2020;
const Book = require('./models/bookModel');

const bookRouter = require('./routes/bookRouter')(Book);

app.use(bodyParser.urlencoded({ encoded: true }));
app.use(bodyParser.json());

app.use('/api', bookRouter);

app.get('/', (request, response) => {
  response.send('Welcome to REST API');
});

app.listen(port, () => {
  console.log(`REST API Running on Port ${port}`);
});