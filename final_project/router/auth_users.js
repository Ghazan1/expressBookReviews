const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }
  
    let existingUser = users.find(user => user.username === username && user.password === password);
    if (!existingUser) {
      return res.status(401).send("Incorrect username or password");
    }
  
    const payload = { username };
    const options = { expiresIn: '1d' };
    const secret = process.env.JWT_SECRET || 'secret';
  
    jwt.sign(payload, secret, options, function(err, token) {
      if (err) {
        return res.status(500).send("Error generating JWT");
      }
      res.json({
        message: "Successful login",
        token: token
      });
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
const isbn = req.params.isbn;
const username = req.session.username;

if (!username) {
    res.status(401).send("You must be logged in to delete a review");
    return;
}

const reviews = books[isbn].reviews.filter(review => review.username !== username);
books[isbn].reviews = reviews;

res.send(`Review deleted successfully`);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.body.review;
    let username = req.user.username;
  
    if (!review) {
      return res.status(400).send("Review is required");
    }
  
    let book = books.find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).send("Book not found");
    }
  
    let existingReview = book.reviews.find(r => r.username === username);
    if (existingReview) {
      existingReview.review = review;
    } else {
      book.reviews.push({ username, review });
    }
  
    res.json({
      message: "Review added/modified successfully",
      book: book
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
