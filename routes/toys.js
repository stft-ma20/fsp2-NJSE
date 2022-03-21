const express = require("express");
const { authToken } = require("../middleware/tokenAuth");
const { userAuth } = require("../middleware/userAuth");
const router = express.Router();
const { ToyModel, validateToy } = require("../models/toyModel");

const NUM = 2; //*number of toys per page

router.get("/", async (req, res) => {
    let pageQ = req.query.page;
    let toysData = await ToyModel.find({});

    if (pageQ && (pageQ <= 0)) {
        return res.json({ msg: "Error page number must be bigger than 0." });
    }
    if (pageQ && ((NUM * pageQ) - toysData.length > 5)) {
        return res.json({ msg: "Page unavilable (not enouth toys..)" });
    }
    if (pageQ) {
        toysData = toysData.filter((item, i) => {
            if (i >= ((pageQ - 1) * NUM) && i < ((pageQ - 1) * NUM) + NUM) {
                return true;
            }
        })

        return res.json(toysData);
    }

    return res.json(toysData);
})

router.get("/search", async (req, res) => {
    let sQ = req.query.s;
    let pageQ = req.query.page;
    let toysData = await ToyModel.find({});

    if (sQ) {

        toysData = toysData.filter(item => {
            if (item.name.toLowerCase().includes(sQ.toLowerCase()) || item.info.toLowerCase().includes(sQ.toLowerCase())) {
                return true;
            }
        })

        if (pageQ && (pageQ <= 0)) {
            return res.json({ msg: "Error page number must be bigger than 0." });
        }
        if (pageQ && ((NUM * pageQ) - toysData.length > 5)) {
            return res.json({ msg: "Page unavilable (not enouth toys..)" });
        }
        if (pageQ) {
            toysData = toysData.filter((item, i) => {
                if (i >= ((pageQ - 1) * NUM) && i < ((pageQ - 1) * NUM) + NUM) {
                    return true;
                }
            })

            return res.json(toysData);
        }

        return res.json(toysData);
    }

})

router.get("/category/:cat", async (req, res) => {

    let toysData = await ToyModel.find({});
    let catQ = req.params.cat;
    let pageQ = req.query.page;
    if (catQ) {

        toysData = toysData.filter(item => {
            if (item.category.toLowerCase() == catQ.toLowerCase()) {
                return true;
            }
        })
        if (toysData.length == 0) {
            return res.json({ msg: "no items in \"" + catQ + "\" caegory was not found!" })
        }

        if (pageQ && (pageQ <= 0)) {
            console.log("<=0")
            return res.json({ msg: "Error page number must be bigger than 0." });
        }
        if (pageQ && ((NUM * pageQ) - toysData.length > 5)) {
            console.log("TOO much!")
            return res.json({ msg: "Page unavilable (not enouth toys..)" });
        }
        if (pageQ) {
            toysData = toysData.filter((item, i) => {
                if (i >= ((pageQ - 1) * NUM) && i < ((pageQ - 1) * NUM) + NUM) {
                    return true;
                }
            })

            return res.json(toysData);
        }
        return res.json(toysData);
    }



})

router.get("/prices", async (req, res) => {
    let minQ = req.query.min;
    let maxQ = req.query.max;
    let toysData = await ToyModel.find({});

    if (minQ && maxQ) {
        toysData = toysData.filter(item => {
            if (item.price >= minQ && item.price <= maxQ) {
                return true;
            }
        })

        return res.json(toysData);
    }

    return res.json({msg:"enter min and max."});
})

router.post("/", authToken, async (req, res) => {

    //adding user_id to toy's data
    req.body.User_id = req.tokenData._id;
    console.log("id:" + req.body.User_id);


    let validatedBody = validateToy(req.body);
    if (validatedBody.error) {
        return res.status(400).json({ msg: validatedBody.error.details });
    }

    try {
        let newToy = new ToyModel(req.body);
        await newToy.save();

        console.log("toy Added to database!");
        console.log(newToy);
        res.json(newToy);
    }
    catch (err) {
        console.log(err)
        res.json(err);
    }
})

router.delete("/:delID", [authToken, userAuth], async (req, res) => {

    console.log(" -" + req.userAuthStatus);

    try {
        let deletionData = await ToyModel.deleteOne({ _id: req.params.delID });
        console.log("toy deleted successfully!");
        res.json(deletionData);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

router.put("/:editID", [authToken, userAuth], async (req, res) => {

    let validatedBody = validateToy(req.body);
    if (validatedBody.error) {
        return res.status(400).json({ msg: validatedBody.error.details });
    }
    try {
        console.log("updating toy's data...");
        let updateData = await ToyModel.updateOne({ _id: req.params.editID }, req.body);
        console.log("toy's data updated successfully!");
        res.json(updateData);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
})

module.exports = router;