// External modules
const express = require("express");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session)
const path = require("path");
require("dotenv").config()
// Instanced modules
const app = express();
// configuration

require("dotenv").config();

// process.on('warning', e => console.warn(e.stack));

const PORT = process.env.PORT || '4000';
// Internal modules
const db = require("./models");
app.set("view engine", "ejs")

const controllers = require("./controllers");


//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    store: new MongoStore({
        url: process.env.MONGODB_URI || "mongodb://localhost:27017/restaurants-db",
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}))
const authRequired = (req, res, next) => {
    if(!req.session.currentUser){
        return res.redirect("/login")
    }
    next();
}


//Routes

//index route


app.get("/", async (req, res) => {
    try {
        const foundRestaurants = await db.Restaurant.find({});
        const context = {
            restaurants: foundRestaurants,
            user: req.session.currentUser,
        }
        res.render("index.ejs", context)
    } catch (error) {
        console.log(error)
        res.send({message: "Internal Error"})
    }
    })


//Controller routes
app.use("/restaurants", controllers.restaurant)

app.use("/reviews", controllers.review)

app.use("/", controllers.auth)



//server listener
app.listen(process.env.PORT || 4000,  () =>  {
    console.log(`Listening to ${PORT}`)
})

