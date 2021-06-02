const express = require('express');
var server = express();
const router = express.Router();
Product = require('../models/product');

router.post('/', async (req,res,next) => {
    console.log("POST on productManagement");
    var newProduct = req.body;
    try {
        const success = await Product.addOne(newProduct);
        res.status(201).json({'msg':'successful insert','productID':success});
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req,res,next) => {
    console.log("GET on productManagement");
    try {
        const success = await Product.findAll();
        res.status(201).json(success);
    } catch (err) {
        next(err);
    }
});


router.get('/:id', async (req,res,next) => {
    console.log("GET on productManagement");
    try {
        const success = await Product.findOne(req.params.id);
        res.status(200).json(success);
    } catch (err) {
        next(err);
    }
});

router.put('/:id/:status', async (req,res,next) => {
    console.log("PUT on productManagement");
    try {
        const success = await Product.updateOne(req.params.id,req.params.status);
        res.status(200).json({"message":`product ${req.params.id} status set to ${req.params.status}`});
    } catch (err) {
        next(err);
    }
});

module.exports = router;