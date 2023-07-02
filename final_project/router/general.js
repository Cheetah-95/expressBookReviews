const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

axios.defaults.baseURL = 'http://localhost:10533';

public_users.post("/register", (req, res) => {
  filteredUsers = users.filter(user => user.username === req.body.username);
  if (req.body.username && req.body.password) {
    if (!isValid(req.body.username)) {
      users.push({ "username": req.body.username, "password": req.body.password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login." });
    }
    return res.status(400).json({ message: "Username already taken. Please choose a different username." });
  }
  return res.status(400).json({ message: "Please enter a username and password." });
});

// Get the book list available in the shop
/* public_users.get('/', function (req, res) {
  return res.send(JSON.stringify({ "books": books }, null, 4));
}); */
//With async, await - Task 10
public_users.get('/', async (req, res) => {
  const allBooks = await books; //axios.get(books) did not work here
  if (allBooks) {
    return res.send(JSON.stringify(allBooks, null, 4));
  }
  return res.send("No books found.");
});

// Get book details based on ISBN
/* public_users.get('/isbn/:isbn', function (req, res) {
  let book = books[req.params.isbn];
  if (book) {
    return res.send(JSON.stringify(book, null, 4));
  }
  return res.send(`No books with ISBN ${req.params.isbn} found.`);
}); */
// With async, await - Task 11
public_users.get('/isbn/:isbn', async (req, res) => {
  const book = await books[req.params.isbn];
  if (book) {
    return res.send(JSON.stringify(book, null, 4));
  }
  return res.send(`No books with ISBN ${req.params.isbn} found.`);
});

// Get book details based on author
/* public_users.get('/author/:author', function (req, res) {
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
}); */
// With async, await - Task 12
public_users.get('/author/:author', async function (req, res) {
  let booksByAuthor = [];
  let allBooks = await books;
  for (let bookISBN in allBooks) {
    if (allBooks[bookISBN].author === req.params.author) {
      booksByAuthor.push({ "isbn": bookISBN, "title": allBooks[bookISBN].title, "reviews": allBooks[bookISBN].reviews });
    }
  }
  if (await booksByAuthor.length > 0) {
    return res.send(JSON.stringify({ "booksbyauthor": booksByAuthor }, null, 4));
  }
  return res.send(`No books written by ${req.params.author} found.`);
});

// Get all books based on title
/* public_users.get('/title/:title', function (req, res) {
  let booksByTitle = [];
  for (let bookISBN in books) {
    if (books[bookISBN].title === req.params.title) {
      booksByTitle.push({ "isbn": bookISBN, "author": books[bookISBN].author, "reviews": books[bookISBN].reviews });
    }
  }
  if (booksByTitle.length > 0) {
    return res.send(JSON.stringify({ "booksbytitle": booksByTitle }, null, 4));
  }
  return res.send(`No books with title ${req.params.title} found.`);
}); */
// With async, await - Task 13
public_users.get('/title/:title', async function (req, res) {
  let booksByTitle = [];
  let allBooks = await books;
  for (let bookISBN in await allBooks) {
    if (allBooks[bookISBN].title === req.params.title) {
      booksByTitle.push({ "isbn": bookISBN, "author": allBooks[bookISBN].author, "reviews": allBooks[bookISBN].reviews });
    }
  }
  if (await booksByTitle.length > 0) {
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
