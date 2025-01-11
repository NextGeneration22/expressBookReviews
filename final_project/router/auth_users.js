const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

function reviewExists(username, isbn){
   return books[isbn].reviews.find(u=> u.username == username)
}

const isValid = (username)=>{ 
  return users.find(u=> u.name == username)
}

const authenticatedUser = (username,password)=>{ 
  return users.find(u=> u.name == username && u.password == password)
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const name = req.body.username;
  const password = req.body.password
  if(name && password){
    if(authenticatedUser(name, password)){
      const accesstoken = jwt.sign({user: name}, "secretkey", {expiresIn:'3600s'})
      req.session.authenticated = {token: accesstoken, user: name}
      res.status(200).send("login is successful!")
    }else{
      res.status(401).send("Usernaem or password is incorrect!")
    }
  }else{
    res.status(400).send("Please provide a your username and your password")
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const name = req.user.user
  const isbn = req.params.isbn
  if(isbn){
    const review = req.query.review;
    if(review){
      if(reviewExists(name, isbn)){
        const userreview = reviewExists(name, isbn)
        userreview.review = review
        res.status(200).send("Thanks the review has been updated!")
      }else{
        books[isbn].reviews.push({username: name, review: review})
        res.status(200).send("thanks for leving us your review!")
      }
    }else{
      res.send('no review was added')
    }
  }else{
    res.status(401).send("Please provide the book isbn!")
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//delete book review
regd_users.delete('/auth/review/:isbn', (req, res)=>{
  const user = req.user.user;
  const isbn = req.params.isbn;
  if(isbn){
    if(reviewExists(user, isbn)){
      books[isbn].reviews = books[isbn].reviews.filter(u => u.username !== user);
      res.status(200).send("the review hss been deleted")
    }else{
      res.status(404).send("you haven't left any review!")
    }
  }else{
    res.status(401).send("Please provide the isbn for the book!")
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
