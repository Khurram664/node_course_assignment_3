const express = require('express');
const router = express.Router();

const verifyToken = require('../modules/verifyToken');
const db = require('../modules/dbConnection');

router.post('/view-cart', function (req, res) {

    console.log('In View Cart');
    var username = req.body.username;
    db.model('Cart').find({ username: username }).
        then(carts => res.json(carts[0])).
        catch(err => res.status(500).json({ message: err.message }));
});

router.post('/add-product-to-cart', function (req, res) {


    console.log('In add to product cart');

    var username = req.body.username;

    db.model('Cart').find({ username: username }).
        then(carts => {

            let cart = carts[0];

            console.log("Cart");
            console.log(cart);


            var name = req.body.product;
            console.log('In products');
            db.model('Product').find({ name: name }).
                then(products => {
                    product = products[0];
                    console.log("Product s ")
                    console.log(product);

                    console.log('id');
                    console.log(product.id);

                    console.log('price');
                    console.log(product.price);

                    console.log('cart.products');
                    console.log(cart.products);

                    let cart_products = cart.products;

                    let product_id = product.id;
                    //display cart array and add product id to array.
                    cart_products.push(product_id);

                    console.log('updated_array');
                    console.log(cart_products);

                    //display price and add price to cart total
                    let updated_price = cart.total_price + product.price;

                    db.model('Cart').updateOne({
                        'username': req.body.username
                    }, {
                            'total_price': updated_price,
                            'products': cart_products
                        }).then((data) => {
                            console.log('Cart Updated');
                            res.json(data);

                        })
                        .catch(err => res.status(500).json({ message: err.message }));
                }).catch(err => res.status(500).json({ message: err.message }));

        }).
        catch(err => res.status(500).json({ message: err.message }));
});


router.post('/cart-checkout', function (req, res) {

    //place order

    console.log('In cart checkout');

    var username = req.body.username;

    db.model('Cart').find({ username: username }).
        then(carts => {

            let cart = carts[0];

            console.log("Cart");
            console.log(cart);


            var name = req.body.product;
            console.log('In products');

            db.model('Cart').updateOne({
                'username': req.body.username
            }, {
                    'status': "complete",
                }).then((data) => {
                    console.log('ORder Placed');
                    res.json({
                        message: "Order Placed"
                    });

                })
                .catch(err => res.status(500).json({ message: err.message }));



        }).
        catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;
