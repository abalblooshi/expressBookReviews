const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
});

// Task 10: Get the list of books available in the shop using async/await
public_users.get('/', async (req, res) => {
    try {
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 11: Get the book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = books[isbn];
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving book" });
    }
});

// Task 12: Get the book details based on Author using async/await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const result = Object.values(books).filter(book => book.author === author);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Books not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 13: Get the book details based on Title using async/await
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const result = Object.values(books).filter(book => book.title === title);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Books not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Existing route for getting reviews
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
