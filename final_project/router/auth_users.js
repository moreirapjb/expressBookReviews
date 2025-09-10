const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return res.status(404).json({message: "Error logging in"});
    }

    if(authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
            data : password
        }, 'access', {expiresIn : 60 * 60})

        req.session.authorization = {
            accessToken,username
        } 
        return res.status(200).send("User successfull logged in")
    }
    else {
        return res.status(208).json({message: "Invalid login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if(books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).send("Review added successfully to the book");
    } else {
        return res.status(404).json({message: `ERROR! The Book with ISBN ${isbn} was not found`});
    }
});

// Deletes a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
  
    if (books[isbn]) {
        let book = books[isbn];
        if (book.reviews && book.reviews[username]) {
            delete book.reviews[username];
            return res.status(200).send("Review deleted successfully from the book");
        } else {
            return res.status(404).json({message: "ERROR! There is no review to this book created by to delete"});
        }
    } else {
        return res.status(404).json({message: `ERROR! The Book with ISBN ${isbn} was not found`});
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
