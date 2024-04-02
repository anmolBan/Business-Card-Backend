const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./jwtSecretFile');
const {verifyAdminData, verifyAtomicity, verifyCardData, verifyCardId, jwtVerification, updateCardDataVerification} = require('./middlewares/adminMiddlware');
const { Admin, Card } = require('./db');
const app = express();


app.use(express.json());


app.post("/admin/signup", verifyAdminData, verifyAtomicity, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try{
        await Admin.create({
            username: username,
            password: password
        })
        .then((response) => {
            res.status(200).json({
                msg: "New Admin Created."
            })
        })
    }
    catch(err){
        res.status(400).json({
            msg: err
        });
    }
});

app.post("/admin/signin", verifyAdminData, async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const admin = await Admin.findOne({
        username: username,
        password: password
    });

    if(admin){
        const token = jwt.sign({
            username,
            password
        }, jwtSecret);
        res.status(200).json({
            msg: token
        });
    }
    else{
        res.status(400).json({
            msg: "Invalid username or password"
        });
    }
});

app.post("/admin/create-card", verifyCardData, jwtVerification, async (req, res) => {

    try{
        const card = await Card.create({
            name: req.body.name,
            description: req.body.description,
            interests: req.body.interests,
            linkedin: req.body.linkedin,
            github: req.body.github
        });
    
        if(card){
            res.status(200).json({
                msg: "New Card Created",
                id: card._id
            });
            return;
        }
        else{
            res.status.json({
                msg: "Something is wrong"
            });
            return;
        }
    }
    catch(err){
        res.status(400).json({
            msg: err.message
        });
    }
});

app.delete("/admin/delete-card", verifyCardId, jwtVerification, async(req, res) => {
    const cardId = req.body.id;
    
    try{
        const objectId = new mongoose.Types.ObjectId(cardId);
        const card = await Card.findOneAndDelete({
            _id: objectId
        });
    
        if(card){
            res.status(200).json({
                msg: "Card Deleted"
            });
        }
    
        else{
            res.status(400).json({
                msg: "No card found with this id"
            });
        }
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            msg: err.message
        })
    }
});

app.put("/admin/update-card", updateCardDataVerification, jwtVerification, async (req, res) => {
    const cardId = req.body.id;
    const updateData = req.body.cardData;
    // console.log(updateData);
    try{
        const objectId = new mongoose.Types.ObjectId(cardId);
        const updatedCard = await Card.findOneAndUpdate({
            _id: objectId
        }, { 
            $set: updateData
        }, { 
            new: true 
        });

        // console.log(updatedCard);
        res.json({
            msg: "Hello"
        });
    }
    catch(err){
        console.log(err);
        res.json({
            msg: err.message
        });
    }
});

app.listen(3000, () => {
    console.log("Bhai server chaalu hai, port", 3000);
})