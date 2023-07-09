const express = require('express');

const db = require('./modules/dbConnection');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_JWT_KEY;

require('dotenv').config();

const verifyToken = (req, res, next) => {


    console.log('verify token');

    console.log(req.headers.authorization);


    const token =
        req.headers.authorization && req.headers.authorization.split(' ')[1];


    if (!token) {
        return res
            .status(401)
            .json({ message: 'Access denied. Token is missing.' });
    }

    console.log('before try');

    try {

        const decodedToken = jwt.verify(token, secretKey);
        console.log('decoded Token');
        console.log(decodedToken);
        const { username, password } = decodedToken;
        req.user = { username, password };
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Access denied. Invalid token.' });
    }
};

const app = express();
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/login_user', function (req, res) {

    var username = req.body.username;
    var password = req.body.password;

    db.model('User').findOne({
        'username': username,
        'password': password
    }).then((data) => {
        console.log('User Found.');

        const token = jwt.sign({ username: username, password: password }, secretKey, { expiresIn: '1h' });
        res.json({
            'token': token,
            'username': username
        });

    }).catch(err => res.status(500).json({ message: err.message }));
});


app.use('/api/users', require('./apis/users'));
app.use('/api/products', require('./apis/products'));
app.use('/api/shopping', require('./apis/shopping'));

port = 3000;

app.listen(port, () => {
    console.log("Hello world assignment3");
    console.log(`Example app listening on port ${port}`);
})
