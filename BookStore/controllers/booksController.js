
function booksController(Book) {
  // ----------- ----------- -------------- ----------
  function post(req, res) {
    var model = req.body;
    //console.log(item);
    const book = new Book(model);

    if (!model.title) {
      res.status(400);
      return res.send("Title is required");
    }

    book.save();
    res.status(201);
    return res.json(book);
  }

  // ----------- ----------- -------------- ----------
  function get(req, res) {
    const host = req.headers.host;
    const query = {};

    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    console.log(req.query, query);

    Book.find(query, (err, books) => {
      if (err) {
        return res.send(err);
      }
      //Add hyper-media links
      const newBooks = books.map((book) => {
        const newBook = book.toJSON();
        newBook._links = {};
        newBook._links.self = `http://${host}/api/books/${book._id}`;
        newBook._links.all = `http://${host}/api/books/`;

        return newBook;
      });
      return res.json(newBooks);
    });
  }
  // ----------- ----------- -------------- ----------
  return { post, get };

}

module.exports = booksController;