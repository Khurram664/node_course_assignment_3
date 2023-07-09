const express = require('express');
const router = express.Router();

const verifyToken = require('../modules/verifyToken');
const db = require('../modules/dbConnection');

router.get('/products', function (req, res) {


    console.log('In products');
    db.model('Product').find().
        then(products => res.json({ products })).
        catch(err => res.status(500).json({ message: err.message }));
});


router.post('/search_products', function (req, res) {

    var name = req.body.name;
    console.log('In products');
    db.model('Product').find({ name: name }).
        then(products => res.json({ products })).
        catch(err => res.status(500).json({ message: err.message }));
});

router.post('/add_product', verifyToken, function (req, res) {

    console.log('Add Product');
    console.log(req.body.name);
    var name = req.body.name;
    var price = req.body.price;
    var category = req.body.category;


    db.model('Product').create({
        'name': name,
        'price': price,
        'category': category
    }).then((data) => {
        console.log('Product Created');
        res.json(data);

    })
        .catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;
