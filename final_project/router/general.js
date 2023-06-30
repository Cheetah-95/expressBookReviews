const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify({ "books": books }, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let book = books[req.params.isbn];
  if (book) {
    return res.send(JSON.stringify(book, null, 4));
  }
  return res.send(`No books with ISBN ${req.params.isbn} found.`);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let booksByAuthor = []
  for (let bookISBN in books) {
    if (books[bookISBN].author === req.params.author) {
      booksByAuthor.push({ "isbn": bookISBN, "title": books[bookISBN].title, "reviews": books[bookISBN].reviews });
    }
  }
  if (booksByAuthor.length > 0) {
    return res.send(JSON.stringify({ "booksbyauthor": booksByAuthor }, null, 4));
  }
  return res.send(`No books written by ${req.params.author} found.`);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let booksByTitle = []
  for (let bookISBN in books) {
    if (books[bookISBN].title === req.params.title) {
      booksByTitle.push({ "isbn": bookISBN, "author": books[bookISBN].author, "reviews": books[bookISBN].reviews });
    }
  }
  if (booksByTitle.length > 0) {
    return res.send(JSON.stringify({ "booksbytitle": booksByTitle }, null, 4));
  }
  return res.send(`No books with title ${req.params.title} found.`);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let book = books[req.params.isbn];
  if (book) {
    return res.send(JSON.stringify(book.reviews, null, 4));
  }
  return res.send(`No books with ISBN ${req.params.isbn} found.`);
});

module.exports.general = public_users;
