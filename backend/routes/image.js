//image-routes
const router = require("express").Router();
const fs = require("fs");
const multer = require("multer");
const imageModel = require("../models/Image");


//save the image data in our computer and then once it is saved here, save it in mongodb
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => { //specify the name of the filename, takes request, file, and callback
        cb(null, file.originalname); //filename will be the og name
    },
});


const upload = multer({ storage: storage }); //ask multer to use this storage

router.post("/:username", upload.single("image"), async (req, res) => {
    try {
        const userHasProfilePic = await imageModel.find({ username: req.params.username });
        //console.log("here");
        //console.log(userHasProfilePic);
        if (userHasProfilePic.length == 0) {
            if (req.file.filename) {
                const saveImage = imageModel({
                    username: req.params.username,
                    img: {
                        data: fs.readFileSync("uploads/" + req.file.filename),
                        contentType: "image/png",
                    },
                });
                saveImage
                    .save()
                    .then((res) => {
                        // console.log("new pfp is saved");
                    })
                    .catch((err) => {
                        console.log(err, "error has occur");
                    });
                res.send(saveImage.img);
            } else {
                res.status(500).json("error, empty image or other error");
            }
        } else {
            if (req.file.filename) {
                const newImage = await imageModel.updateOne(
                    { username: req.params.username },
                    {
                        $set: {
                            img: {
                                data: fs.readFileSync("uploads/" + req.file.filename),
                                contentType: "image/png",
                            }
                        }
                    }
                );
                res.send(newImage.img)
                // console.log("updated pfp");
            } else {
                res.status(500).json("error, empty image or other error");
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:username', async (req, res) => {
    try {
        const allData = await imageModel.find({ username: req.params.username })
        res.json(allData)
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:username', async (req, res) => {
    try {
        try {
            await imageModel.deleteMany({
                username: req.params.username
            });
            res.status(200).json("profile pic has been deleted");
            // console.log("deleted pfp");
        } catch (err) {
            res.status(500).json(err);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});



module.exports = router;

