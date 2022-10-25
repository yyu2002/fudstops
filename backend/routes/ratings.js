const router = require("express").Router();
const Rating = require("../models/Rating");

//send user's rating to DB, if it exists alr then update
router.post("/", async (req, res) => {

    try {

        const findRating = await Rating.findOne({ //findOne returns null if no matching doc found
            username:   req.body.username,
            menuItemID: req.body.menuItemID
        });

        if(findRating) { //first see if there is already a rating in the DB for this user + menu item


            const updatedRating = await Rating.findByIdAndUpdate(findRating._id, {
                rating: req.body.rating
            }, {new: true}); // this will return the modified document after updating the rating

            res.status(201).json("Rating updated for: " + updatedRating);
            return;

        } else {  //if not then make a new document in the DB

            console.log("new rating");
            console.log(req.body);

            const newRating = await new Rating({
                username:   req.body.username,
                menuItemID: req.body.menuItemID,
                rating: req.body.rating
            }).save();

            res.status(201).json("New Rating created: " + newRating);
            return;

        }

    } catch(error) {
        res.status(500).json(error);
        console.log("Error: " + error);
    }

});

//get a user's rating of a specific menu item
router.get("/:username/:menuItemId", async (req, res) => {

    try{

        //find the doc with the matching username and menuItemId
        const findRating = await Rating.findOne({
            username:   req.params.username,
            menuItemID: req.params.menuItemId
        });

        if(!findRating) { //this means a rating doc was not found

            res.status(500).json("No doc found ");
            return;

        } 

        res.status(200).json(findRating);

    } catch(error) {

        res.status(500).json("Error: " + error);

    }

});

//get avg rating of all users of a menu item 
router.get("/:menuItemId", async (req, res) => {

    try{

        const ratingObjs = await Rating.find({
            menuItemID: req.params.menuItemId
        });

        if(!ratingObjs) { //if no indices of this menu item are found, avg rating is N/A

            res.status(200).json({"avgRating": "N/A"});
            return;

        } else {

            let total = 0;
            let numRatings = ratingObjs.length;

            ratingObjs.forEach( ratingObj => total += ratingObj.rating );

            let avg = total/numRatings;

            res.status(200).json({"avgRating": avg});
            return;

        }

    } catch(error) {

        res.status(500).json("Error: " + error);
        console.log("Error: " + error);

    }

});

module.exports = router;