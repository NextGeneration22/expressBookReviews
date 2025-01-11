const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"secretkey",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
   const tokenmessage = req.session.authenticated
   if(!tokenmessage){
    return res.send("you don't have access! you must login first.")
   }
   jwt.verify(tokenmessage.token, "secretkey", (err, user)=>{
    if(err){
        return res.status(401).send("You are not one of our users!")
    }
    req.user = user;
    next()
   })
//Write the authenication mechanism here
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
