const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }
  
    let existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }
  
    let newUser = {
      username: username,
      password: password
    };
    users.push(newUser);
  
    res.send("User registered successfully");
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:3000/books');
        const books = response.data;
        res.send(JSON.stringify(books, null, 2));
    } catch (error) {
        console.error(error);
        res.status(500).send('Error while retrieving books');
    }
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    axios.get('http://localhost:3000/books')
    .then(function (response) {
      var books = response.data;
      var book = books.find(function (book) {
        return book.isbn === req.params.isbn;
      });
      if (book) {
        res.send(JSON.stringify(book, null, 2));
      } else {
        res.status(404).send("Book not found");
      }
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send("Server Error");
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    try {
      const response = await axios.get(`http://localhost:3000/books`);
      const books = response.data;
      const filteredBooks = books.filter(book => book.author === author);
      if (filteredBooks.length === 0) {
        res.status(404).send(`No book found with author "${author}"`);
      } else {
        res.send(JSON.stringify(filteredBooks, null, 2));
      }
    } catch (error) {
      res.status(500).send(`Error while retrieving books: ${error}`);
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    let title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:3000/title/${title}`);
        const book = response.data;
        res.send(JSON.stringify(book));
      } catch (error) {
        console.error(error);
      }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let book = books.find(book => book.isbn === isbn);
  
    if (book) {
      let reviews = book.reviews;
      res.send(JSON.stringify(reviews, null, 2));
    } else {
      res.status(404).send("No reviews found for the specified ISBN");
    }
});

module.exports.general = public_users;
