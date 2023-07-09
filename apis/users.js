const express = require('express');
const router = express.Router();

const verifyToken = require('../modules/verifyToken');
const db = require('../modules/dbConnection');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_JWT_KEY;
//require('dotenv').config();
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

router.post('/add_user', verifyToken, function (req, res) {

    console.log('Add user');
    console.log(req.body.name);
    var name = req.body.name;
    var username = req.body.username;
    var password = req.body.password;


    db.model('User').create({
        'name': name,
        'username': username,
        'password': password,
    }).then((data) => {
        console.log('User Created');
        res.json(data);

    })
        .catch(err => res.status(500).json({ message: err.message }));
});

router.post('/update_user', verifyToken, function (req, res) {

    console.log('Find users from', db.name);
    var name = req.body.name;
    var password = req.body.password;

    db.model('User').updateOne({
        'password': password
    }, {
            'name': name
        }).then((data) => {
            console.log('User Updated');
            res.json(data);

        })
        .catch(err => res.status(500).json({ message: err.message }));
});

router.post('/delete_user', verifyToken, function (req, res) {


    var name = req.body.username;

    db.model('User').deleteOne({
        'username': username,
    }).then((data) => {
        console.log('User Deleted');
        res.json(data);

    }).catch(err => res.status(500).json({ message: err.message }));
});

module.exports = router;
