const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
const name = req.body.username;
const password = req.body.password;
if(name && password){
  if(isValid(name)){
    res.status(409).send("user already exists!")
  }else{
    users.push({
      name: name,
      password: password
    })
   res.status(200).send("customer has been register, you can login now")
  }
}else{
  res.status(400).send("please provide a username and password!")
}
//return res.status(300).json({message: "Yet to be implemented"});
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
  getbook.then(respond => res.status(200).send(respond))
         .catch(err => res.status(404).send(err))
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  const getbook = new Promise((resolve, reject)=>{
    const book = Object.values(books).find(u=> u.author == author)
    if(book){
        resolve(book)
    }else{
        reject('sorry we don\'t work with this autore right now!' )
    }
  })

  try{
    const data = await getbook
    res.status(200).send(data)
  }catch(err){
    res.status(404).send(err)
  }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title
    const getbook = new Promise((resolve, reject)=>{
      const book = Object.values(books).find(b=> b.title == title);
      if(book){
        resolve(book)
      }else{
        reject("We don't have this book you are looking for. Come back later!")
      }
    })
    try{
      const data = await getbook
      res.status(200).send(data)
    }catch(err){
      res.status(404).send(err)
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn
  const getbookreview = new Promise((resolve, reject)=>{
    const book = books[isbn]
    if(book){
      if(Object.keys(book.reviews).length === 0 ){
        resolve("The book dose'nt have reviews yet. you can add your owen review!")
      }else{
        resolve(book.reviews)
      }
    }else{
      reject("sorry we don't have what you are looking for!")
    }
  })
  try{
    const data = await getbookreview;
    res.status(200).send(data)
  }catch(err){
       res.status(404).send(err)
  }
//return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
