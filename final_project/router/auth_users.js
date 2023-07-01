const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let filteredUsers = users.filter(user => user.username === username);
  if (filteredUsers.length > 0) {
    return true;
  }
  return false;
}

const authenticatedUser = (username, password) => {
  if (isValid(username)) {
    let filteredUsers = users.filter(user => user.username === username);
    if (filteredUsers.length > 0 && filteredUsers[0].password === password) {
      return true;
    }
  }
  return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const user = req.body.username;
  if (authenticatedUser(user, req.body.password)) {
    let accessToken = jwt.sign({data: user}, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {accessToken};
    return res.send("Customer successfully logged in.");
  }
  return res.status(400).json({ message: "Incorrect username or password." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn];
  let user = req.user.data;
  if (book) {
    book.reviews[user] = req.query.review;
    return res.send(`The review for the book with ISBN ${req.params.isbn} has been added/updated.`);
  }
  return res.status(400).json({ message: `Book with ISBN ${req.params.isbn} not found.` });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let book = books[req.params.isbn];
  let user = req.user.data;
  if (book) {
    delete book.reviews[user]
    return res.send(`The review for the book with ISBN ${req.params.isbn} posted by the user ${user} deleted.`);
  }
  return res.status(400).json({ message: `Book with ISBN ${req.params.isbn} not found.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
