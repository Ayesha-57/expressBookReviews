const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user. Username and password are required."});
});

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    let getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });
    
    let response = await getBooks;
    return res.status(200).send(JSON.stringify(response, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books", error: error.message});
  }
});

// Task 11: Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    let getBookByIsbn = new Promise((resolve, reject) => {
      let book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject({status: 404, message: "Book not found"});
      }
    });

    let book = await getBookByIsbn;
    return res.status(200).send(JSON.stringify(book, null, 4));
  } catch (error) {
    return res.status(error.status || 500).json({message: error.message || "Internal server error"});
  }
});
 
// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    let getBooksByAuthor = new Promise((resolve, reject) => {
      let filtered_books = [];
      let keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].author === author) {
          filtered_books.push(books[key]);
        }
      });
      resolve(filtered_books);
    });

    let booksByAuthor = await getBooksByAuthor;
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by author"});
  }
});

// Task 13: Get all books based on title using async-await
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    let getBooksByTitle = new Promise((resolve, reject) => {
      let filtered_books = [];
      let keys = Object.keys(books);
      keys.forEach((key) => {
        if (books[key].title === title) {
          filtered_books.push(books[key]);
        }
      });
      resolve(filtered_books);
    });

    let booksByTitle = await getBooksByTitle;
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } catch (error) {
    return res.status(500).json({message: "Error fetching books by title"});
  }
});

// Task 5: Get book review based on ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;