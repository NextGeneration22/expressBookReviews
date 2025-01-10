const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write yo
  return res.status(300).json({message: "Yet to be implemented"});
});

const getbooks = ()=>{
    return new Promise((resolve, reject)=>{
        resolve(books)
    })
}
// Get the book list available in the shop
public_users.get('/', async (req, res)=> {
   try{
    const data = await getbooks()
   res.status(200).send(JSON.stringify(data))
   }catch(error){
     return res.status(300).json({message: "sorry somthing went wrong"});
   }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const getbook = new Promise((resolve, reject)=>{
    const book = books[isbn]
    if(book){
        resolve(book)
    }else{
        reject('sorry we don\'t have what you\'re looking for!')
    }
  })
  getbook.then(respond => res.send(respond))
         .catch(err => res.send(err))
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toString;
  const getbook = new Promise((resolve, reject)=>{
    const book = object.values(books).find(u=> u.author == author)
    if(book){
        resolve(book)
    }else{
        reject('sorry we don\'t work with this autore right now!' )
    }
  })
  getbook.then(resp=> res.status(200).send(resp))
          .catch(err=>res.send(err))
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
