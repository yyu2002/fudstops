// users.js - API for users (updating, deleting, getting)
const router = require("express").Router();
const User = require("../models/User");
const Image = require("../models/Image");
const Preference = require("../models/Preference");
const Restriction = require("../models/Restriction");
const Problem = require("../models/Problem");
const Rating = require("../models/Rating");
const ResetPasswordToken = require("../models/ResetPasswordToken");
const Saved = require("../models/Saved");
const Notify = require("../models/Notify");
const CryptoJS = require("crypto-js");
const verify = require("../verifyToken");


// UPDATE - update user
router.put("/:id", verify, async (req, res) => { // ":" is param and "?" is query param
    if (req.user.id === req.params.id || req.user.isAdmin) { // if valid user or user is admin
        if (req.body.password) { // if password required get decrypted password
            req.body.password = CryptoJS.AES.encrypt(
                req.body.password,
                process.env.SECRET_KEY
            ).toString();
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { // update user info to whatever is in the body of the request
                    $set: req.body // update parameters in the body
                },
                { new: true } // makes sure the updated user is returned in the JSON
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can only update your own account!");
    }
});

/* update all other DB info when username changes */
router.put("/updateDBs/:newUsername/:oldUsername", async (req, res) => {
    try {
        /* update user image */
        await Image.findOneAndUpdate(
            {
                username: req.params.oldUsername
            },
            {
                username: req.params.newUsername
            });

        /* update notify */
        await Notify.findOneAndUpdate(
            {
                username: req.params.oldUsername
            },
            {
                username: req.params.newUsername
            });

        /* update preferences */
        await Preference.findOneAndUpdate(
            {
                username: req.params.oldUsername
            },
            {
                username: req.params.newUsername
            });

        /* update restrictions */
        await Restriction.findOneAndUpdate(
            {
                username: req.params.oldUsername
            },
            {
                username: req.params.newUsername
            });

        /* update problem */
        await Problem.findOneAndUpdate(
            {
                username: req.params.oldUsername
            },
            {
                username: req.params.newUsername
            });
        
        /* update rating */
        await Rating.findOneAndUpdate(
            {
                username: req.params.oldUsername
            },
            {
                username: req.params.newUsername
            });

        /* update saved */
        await Saved.findOneAndUpdate(
            {
                username: req.params.oldUsername
            },
            {
                username: req.params.newUsername
            });
        
        res.status(201).json("Successfully updated other DB info after username change");
    } catch (error) {
        res.status(500).json("Error updating other DB info after username change");
    }
});

/* DELETE - delete user 
- Need to delete all user information from other tables as well
*/
router.delete("/:id/:username", verify, async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) { // if valid user or user is admin
        try {
            /* delete user */
            await User.findByIdAndDelete(req.params.id);

            /* delete user's profile picture */
            await Image.deleteMany({
                username: req.params.username
            });

            /* delete user's preferences */
            await Preference.deleteMany({
                username: req.params.username
            });

            /* delete user's restrictions */
            await Restriction.deleteMany({
                username: req.params.username
            });

            /* Delete user's problems */
            await Problem.deleteMany({
                username: req.params.username
            });

            /* Delete user's ratings */
            await Rating.deleteMany({
                username: req.params.username
            });

            /* Delete user's reset password tokens */
            await ResetPasswordToken.deleteMany({
                username: req.params.id
            });

            /* Delete user's saved items */
            await Saved.deleteMany({
                username: req.params.username
            });

            /* Delete user's notify data */
            await Notify.deleteMany({
                username: req.params.username
            });

            /* recalculate average ratings for all menu items? --> would take to long so ignore for now */

            res.status(200).json("User has been deleted");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You can only delete your own account!");
    }
});

// GET - get 1 user
router.get("/find/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...info } = user._doc; // split password from user data --> return everything but password in JSON response
        res.status(200).json(info); // return everything but password in info
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL - get all users
router.get("/", verify, async (req, res) => {
    const query = req.query.new;
    if (req.user.isAdmin) { // only admin can get all users
        try {
            const users = query
                ? await User.find().sort({ _id: -1 }).limit(10)
                : await User.find(); // fetch the 2 newest users if 'new' query param is true
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You are not allowed to see all users");
    }
});

// GET USER STATS - get user statistics (total users per month)
// router.get("/stats", async (req, res) => {
//     const today = new Date();
//     const lastYear = today.setFullYear(today.setFullYear() - 1); // 1 year ago

//     const monthsArray = [
//         "January",
//         "February",
//         "March",
//         "April",
//         "May",
//         "June",
//         "July",
//         "August",
//         "September",
//         "October",
//         "November",
//         "December"
//     ];

//     try {
//         const data = await User.aggregate([ // aggregates users by month
//             {
//                 $project: { // include these fields when aggregating
//                     month: { $month: "$createdAt" } // applies month to createdAt field --> returns int value representing month
//                 }
//             }, {
//                 $group: { // group documents by the group keys
//                     _id: "$month", // group key is month
//                     total: { $sum: 1 } // +1 for each doc in group (total number of users per month)
//                 }
//             }
//         ])
//         res.status(200).json(data);
//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

module.exports = router;