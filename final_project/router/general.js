const express = require("express");
let books = require("../data/booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         title:
 *           type: string
 *           description: The title of your book
 *         author:
 *           type: string
 *           description: The book author
 *       example:
 *         title: The New Turing Omnibus
 *         author: Alexander K. Dewdney
 */

/**
 * @swagger
 * tags:
 *   name: General
 *   description: Endpoint available without Authentication
 * /register:
 *   post:
 *     summary: Register a new User
 *     tags: [Register]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json
 *       500:
 *         description: Some server error
 * /books:
 *   get:
 *     summary: Get All available books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The available books list
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error
 * /books/isbn/{isbn}:
 *   get:
 *     summary: Get the books by isbn
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: The book isbn
 *     responses:
 *       200:
 *         description: The book response by isbn
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 * 
 * /books/author/{auhor}:
 *   get:
 *     summary: Get the books by auhor
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: auhor
 *         schema:
 *           type: string
 *         required: true
 *         description: The book auhor
 *     responses:
 *       200:
 *         description: The book response by auhor
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 * 
 * /books/title/{title}:
 *   get:
 *     summary: Get the books by title
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: The book title
 *     responses:
 *       200:
 *         description: The book response by title
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */

public_users.post("/register", (req, res) => {
  //Write your code here
  const user_name = req.query.username;
  const password = req.query.password;

  if (!user_name || !password) {
    return res
      .status(400)
      .json({ message: "Username and/or Password not provided" });
  }

  if (!isValid(user_name)) {
    return res.status(400).json({ message: "Username already exists" });
  }
  const newUser = { username: user_name, password: password };
  users.push(newUser);
  res.send(newUser);
});

// Get the book list available in the shop
public_users.get("/books", function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/books/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/books/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  const filtered_books = {};
  Object.keys(books).forEach((key) => {
    if (books[key].author === author) {
      filtered_books[key] = { ...books[key] };
    }
  });
  res.send(JSON.stringify(filtered_books, null, 4));
});

// Get all books based on title
public_users.get("/books/title/:title", function (req, res) {
  const title = req.params.title;
  const filtered_books = {};
  Object.keys(books).forEach((key) => {
    if (books[key].title === title) {
      filtered_books[key] = { ...books[key] };
    }
  });
  res.send(JSON.stringify(filtered_books, null, 4));
});

//  Get book review
public_users.get("books/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

// Task 10
// Add the code for getting the list of books available in the shop (done in Task 1) using Promise callbacks or async-await with Axios

function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  getBookList().then(
    (result) => res.send(JSON.stringify(result, null, 4)),
    (error) => res.send(`An error occurred: ${error}`)
  );
});

// Task 11
// Add the code for getting the book details based on ISBN (done in Task 2) using Promise callbacks or async-await with Axios.

function getFromISBN(isbn) {
  let book_ = books[isbn];
  return new Promise((resolve, reject) => {
    if (book_) {
      resolve(book_);
    } else {
      reject("Unable to find book!");
    }
  });
}

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (result) => res.send(JSON.stringify(result, null, 4)),
    (error) => res.send(`An error occurred: ${error}`)
  );
});

// Task 12
// Add the code for getting the book details based on Author (done in Task 3) using Promise callbacks or async-await with Axios.

function getFromAuthor(author) {
  let output = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.author === author) {
        output.push(book_);
      }
    }
    resolve(output);
  });
}

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  getFromAuthor(author).then((result) =>
    res.send(JSON.stringify(result, null, 4))
  );
});

// Task 13
// Add the code for getting the book details based on Title (done in Task 4) using Promise callbacks or async-await with Axios.

function getFromTitle(title) {
  let output = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title) {
        output.push(book_);
      }
    }
    resolve(output);
  });
}

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  getFromTitle(title).then((result) =>
    res.send(JSON.stringify(result, null, 4))
  );
});

module.exports.general = public_users;
