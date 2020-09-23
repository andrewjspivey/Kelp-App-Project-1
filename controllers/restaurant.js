const express = require("express");
const { restaurant } = require(".");
const router = express.Router();

const db = require("../models");
//const { User } = require("../models");

//this controller 

//base routes

//All restaurant page
router.get("/", async (req, res) => {
try {
    const foundRestaurants = await db.Restaurant.find({});
    const context = {
        restaurants: foundRestaurants,
    }
    res.render("restaurant/index", context)
} catch (error) {
    console.log(error)
    res.send({message: "Internal Error"})
}
})


//new route
router.get("/new", (req, res) => {
    res.render("restaurant/new")
})


//create route - TODO add images and connection to reviews
router.post('/', (req, res)=>{
    if(req.body.delivery === 'on') {
        req.body.delivery = true;
    } else {
        req.body.delivery = false;
    }
    if(req.body.takeOut === 'on') {
        req.body.takeOut = true;
    } else {
        req.body.takeOut = false;
    }
    if(req.body.dineIn === 'on') {
        req.body.dineIn = true;
    } else {
        req.body.dineIn = false;
    }
    req.body.user = req.session.currentUser.id //adds current user id to user field in created restaurant
    console.log(req.body)
    db.Restaurant.create(req.body, (error, createdRestaurant)=>{
        if (!createdRestaurant) {
            return res.send({message: "Restaurant already exists"})
        } // TODO make functionality to not let restaurants be duplicated to db
        res.redirect('/restaurants'); 
    });
});


// show route
router.get("/:id", (req, res) => {
    db.Restaurant.findById(req.params.id)
        .populate("review")
        .exec((error, foundRestaurant) => {
        if (error) {
          console.log(error);
          return res.send(error);
        }
    const context = {
        restaurant: foundRestaurant
    };
    res.render("restaurant/show", context)
    });
});


// Specific restaurant new review route
router.get("/:id/newreview", (req,res) => {
    db.Restaurant.findById(req.params.id, (error, foundRestaurant) => {
        if (error) {
            console.log(error);
            return res.send(error);
          }
        const context = {
            restaurant: foundRestaurant
        };
        res.render("review/idnew", context)
    });
});

// Create route for specific restaurant review
router.post("/:id", async (req, res) =>{
    console.log(req.body)
    try {
        /* if(req.body.recommend === "on"){
            req.body.recommend = true
        } else {
            req.body.recommend = false;
        } */
        req.body.restaurant = req.params.id
        const createdReview = await db.Review.create(req.body);
        const foundRestaurant = await db.Restaurant.findById(req.body.restaurant);
    
        foundRestaurant.review.push(createdReview);
        await foundRestaurant.save();
    
        res.redirect("/restaurants");
      } catch (error) {
        console.log(error);
        res.send({ message: "Internal server error" });
      }
})



//edit route
router.get("/:id/edit", async (req, res) =>{
    try {
        const foundRestaurant = await db.Restaurant.findById(req.params.id)
        const context = {
            restaurant: foundRestaurant,
        }
        console.log(foundRestaurant.user)
        if (foundRestaurant.user == req.session.currentUser.id) {
            res.render("restaurant/edit", context)
        } else {
            res.send({message: "You are not authorized to edit this restaurant"})
        } 
    } catch (error) {
        res.send({message:"Internal Service Error"})
        console.log(error)
    }    
})


//update route

router.put("/:id", async (req, res) =>{
    //console.log(req.session.currentUser.id)
    if(req.body.delivery === 'on') {
        req.body.delivery = true;
    } else {
        req.body.delivery = false;
    }
    if(req.body.takeOut === 'on') {
        req.body.takeOut = true;
    } else {
        req.body.takeOut = false;
    }
    if(req.body.dineIn === 'on') {
        req.body.dineIn = true;
    } else {
        req.body.dineIn = false;
    }
    try {
        const updatedRestaurant = await db.Restaurant.findByIdAndUpdate(req.params.id, req.body, {new: true})
        console.log(req.body)
        res.redirect(`/restaurants/${updatedRestaurant._id}`)
    } catch (error) {
        console.log(error);
        return res.send({message:"Internal Service Error"});
    }
}) 

//delete
router.delete("/:id", async (req, res) => {
    try {
         await db.Restaurant.findByIdAndDelete(req.params.id) 
         res.redirect("/restaurants");
    } catch (error) {
        console.log(error);
        return res.send({message:"Internal Service Error"});
    }
});
module.exports = router;