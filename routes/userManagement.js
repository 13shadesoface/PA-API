const express = require('express');
var server = express();
const router = express.Router();
User = require('../models/user');

router.post('/', async (req,res,next) => {
    console.log("POST on userManagement");
    var newUser = req.body;
    try {
        const success = await User.addOne(newUser);
        res.status(201).json({'msg':'successful insert','userID':success});
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req,res,next) => {
    console.log("GET on userManagement");
    try {
        const success = await User.findAll();
        res.status(200).json(success);
    } catch (err) {
        next(err);
    }
});


router.get('/:id', async (req,res,next) => {
    console.log("GET on userManagement");
    try {
        const success = await User.findOne(req.params.id);
        res.status(200).json(success);
    } catch (err) {
        next(err);
    }
});

module.exports = router