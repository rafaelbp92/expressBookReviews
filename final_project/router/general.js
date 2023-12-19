const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    users.push({ "username": req.query.username, "password": req.query.password });
    res.send("The user" + (' ') + (req.query.firstName) + " Has been added!")
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    const book_list = Object.keys(books).map(key => { return books[key] });
    res.send(book_list);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const book_list = Object.keys(books).map(key => { return books[key] });
    let filtered_book = book_list.filter(b => { return b.isbn === isbn })[0];
    res.send(filtered_book);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;
    const book_list = Object.keys(books).map(key => { return books[key] });
    let filtered_books = book_list.filter(b => { return b.author === author });
    res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const book_list = Object.keys(books).map(key => { return books[key] });
    let filtered_books = book_list.filter(b => { return b.title === title });
    res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book_list = Object.keys(books).map(key => { return books[key] });
    let filtered_book = book_list.filter(b => { return b.isbn === isbn })[0];
    let bookReviews = filtered_book.reviews;
    res.send(bookReviews);
});

module.exports.general = public_users;
