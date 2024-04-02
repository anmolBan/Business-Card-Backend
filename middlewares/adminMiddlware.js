const { adminData, createCard, cardId, updateCard } = require('../types');
const { Admin } = require('../db');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../jwtSecretFile');

function verifyAdminData(req, res, next){
    const createPayload = req.body;
    const parsedPayload = adminData.safeParse(createPayload);

    if(!parsedPayload.success){
        res.status(411).json({
            msg: "You have send the wrong inputs."
        });
        return;
    }
    next();
}

async function verifyAtomicity(req, res, next){
    const username = req.body.username;
    const password = req.body.password;

    const admin = await Admin.findOne({
        username: username,
        password: password
    });

    if(admin){
        res.status(400).json({
            msg: "User Already Exists"
        });
        return;
    }
    next();

}

function verifyCardData(req, res, next){
    const createPayload = req.body;
    const parsedPayload = createCard.safeParse(createPayload);

    if(!parsedPayload.success){
        res.status(400).json({
            msg: "You have sent the wrong inputs"
        });
        return;
    }
    next();
}

function verifyCardId(req, res, next){
    const id = req.body.id;
    const response = cardId.safeParse(id);

    if(!response.success){
        res.status(400).json({
            msg: "You have sent the wrong card id."
        });
        return;
    }
    next();
}

async function jwtVerification(req, res, next){
    let unfilteredToken = req.headers.authorization;
    unfilteredToken = unfilteredToken.split(" ");
    const token = unfilteredToken[1];

    try{
        const response = jwt.verify(token, jwtSecret);
    
        const admin = await Admin.findOne({
            username: response.username,
            password: response.password
        });
    
        if(!admin){
            res.status(404).json({
                msg: "You are not admin"
            });
            return;
        }
        next();
    }
    catch(err){
        console.log(err);
        res.status(400).json({
            msg: err.message
        });
    }
}

function updateCardDataVerification(req, res, next){
    const createPayload = req.body;
    const parsedPayload = updateCard.safeParse(createPayload);
    try{
        if(!parsedPayload.success){
            res.status(400).json({
                msg: "You have send the wrong inputs"
            });
            return;
        }
        next();
    }
    catch(err){
        console.log(err);
        res.json({
            msg: err.message
        });
    }
}

module.exports = {
    verifyAdminData: verifyAdminData,
    verifyAtomicity: verifyAtomicity,
    verifyCardData: verifyCardData,
    verifyCardId: verifyCardId,
    jwtVerification: jwtVerification,
    updateCardDataVerification: updateCardDataVerification
}