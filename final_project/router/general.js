const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      const userExists = users.some(user => user.username === username);
      if (!userExists) {
          users.push({"username":username,"password":password});
          return res.status(201).json({message: "User successfully registered. You can now login"});
      } else {
          return res.status(409).json({message: "ERROR! A User already exists with the given username!"});
      }
  }
  return res.status(400).json({message: "ERROR! Unable to register user. Please provide a username and a password."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.json(books[isbn]);
  } else {
      return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const author = req.params.author;
  const booksByAuthor = [];
  for (const bookId in books) {
      if (books[bookId].author === author) {
          booksByAuthor.push(books[bookId]);
      }
  }
  if (booksByAuthor.length > 0) {
      return res.json(booksByAuthor);
  } else {
      return res.status(404).json({message: "No books were found for this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title;
  const booksByTitle = [];
  for (const bookId in books) {
      if (books[bookId].title === title) {
          booksByTitle.push(books[bookId]);
      }
  }
  if (booksByTitle.length > 0) {
      return res.json(booksByTitle);
  } else {
      return res.status(404).json({message: "No books were found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn;
  if (books[isbn] && books[isbn].reviews) {
      return res.json(books[isbn].reviews);
  } else {
      return res.status(404).json({message: "Reviews were not found for this book"});
  }
});

// Task 10: Add the code for getting the list of books available in the shop (done in Task 1) 
// using Promise callbacks or async-await with Axios.
public_users.get('/', async function (req, res) {
    try {
        // Simulate an async fetch (normally you'd use an API endpoint here)
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                resolve(books);
            });
        };
        const allBooks = await getBooks();
        res.send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
        res.status(500).json({message: "Error getting the list of books"});
    }
});

// Task 11: Add the code for getting the book details based on ISBN (done in Task 2) 
// using Promise callbacks or async-await with Axios.
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const getBookByIsbn = (isbn) => {
            return new Promise((resolve, reject) => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("Book not found");
                }
            });
        };
        const book = await getBookByIsbn(isbn);
        res.json(book);
    } catch (err) {
        res.status(404).json({message: err});
    }
});

// Task 12: Add the code for getting the book details based on Author (done in Task 3) 
// using Promise callbacks or async-await with Axios.
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const getBooksByAuthor = (author) => {
            return new Promise((resolve, reject) => {
                const booksByAuthor = [];
                for (const bookId in books) {
                    if (books[bookId].author === author) {
                        booksByAuthor.push(books[bookId]);
                    }
                }
                if (booksByAuthor.length > 0) {
                    resolve(booksByAuthor);
                } else {
                    reject("No books were found for this author");
                }
            });
        };
        const booksByAuthor = await getBooksByAuthor(author);
        res.json(booksByAuthor);
    } catch (err) {
        res.status(404).json({message: err});
    }
});

// Task 13: Add the code for getting the book details based on Title (done in Task 4) 
// using Promise callbacks or async-await with Axios.
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const getBooksByTitle = (title) => {
            return new Promise((resolve, reject) => {
                const booksByTitle = [];
                for (const bookId in books) {
                    if (books[bookId].title === title) {
                        booksByTitle.push(books[bookId]);
                    }
                }
                if (booksByTitle.length > 0) {
                    resolve(booksByTitle);
                } else {
                    reject("No books were found with this title");
                }
            });
        };
        const booksByTitle = await getBooksByTitle(title);
        res.json(booksByTitle);
    } catch (err) {
        res.status(404).json({message: err});
    }
});

module.exports.general = public_users;
