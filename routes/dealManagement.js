const express = require('express');
var server = express();
const router = express.Router();
Deal = require('../models/deal');

router.post('/', async (req,res,next) => {
    console.log("POST on dealManagement");
    var newDeal = req.body;
    try {
        const success = await Deal.addOne(newDeal);
        res.status(201).json({'msg':'successful insert','dealID':success});
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req,res,next) => {
    console.log("GET on dealManagement");
    try {
        const success = await Deal.findAll();
        res.status(201).json(success);
    } catch (err) {
        next(err);
    }
});


router.get('/:id', async (req,res,next) => {
    console.log("GET on dealManagement");
    try {
        const success = await Deal.findOne(req.params.id);
        res.status(200).json(success);
    } catch (err) {
        next(err);
    }
});

module.exports = router;