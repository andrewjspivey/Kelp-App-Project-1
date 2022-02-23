const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcryptjs");


// Register Form

router.get("/register", (req, res) => {
    res.render("auth/register")
});

//Register Post
router.post("/register", async (req, res) => {
    console.log('form data:', req.body)
    try {
        const foundUser = await db.User.findOne({email: req.body.email})
        if(foundUser){
            return res.send({message: "This email address is already registered"})
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt)
        req.body.password = hash;
        await db.User.create(req.body)
        res.redirect("/")
    } catch (error) {
        res.send({message: "Internal Error"})
        console.log(error)
    }
})

//Login

router.get("/login", (req, res) => {
    res.render("auth/login")
});
//login post

router.post("/login", async (req, res) => {
    try {
        const foundUser = await db.User.findOne({email: req.body.email});
        if(!foundUser){
            return res.send({message: "Email or Password is Incorrect"});
        }
            const match = await bcrypt.compare(req.body.password, foundUser.password)
        if(!match){
            return res.send({message: "Email or Password Incorrect"})
        }
       req.session.currentUser = {
           username: foundUser.username,
           id: foundUser._id
       } 
       res.redirect("/")
    } catch (error) {
        console.log(error),
        res.send({message: "Internal Error"})
    }
})

//logout 

router.delete("/logout", async (req, res) =>{
    await req.session.destroy();
    res.redirect("/")
})

module.exports = router;