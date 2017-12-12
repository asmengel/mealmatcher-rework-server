
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios= require('axios');
const { PORT, CLIENT_ORIGIN, KEY } = require('./config');
const { dbConnect } = require('./db-mongoose');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
const { router: authRouter, basicStrategy, jwtStrategy } = require('./auth');
const { router: usersRouter } = require('./users');
passport.use(basicStrategy);
passport.use(jwtStrategy);
const app = express();

let headers = {
    'Accept': 'application/json',
    'user-key': KEY
};
// endpoints
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Request-Headers");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// ###################################################### finish this later having issues making back end api calls
// app.get('/searchresults', (req, res) => {
//     let url = 'https://developers.zomato.com/api/v2.1/search?q=orlando';
//     axios.get(url, headers)
//     .then(response => {
//         return console.log(response.json());
//     }).catch(err)

// }

//);
app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
        skip: (req, res) => process.env.NODE_ENV === 'test'
    })
);

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// make this shoot the template for 404 to prevent 200 status code
app.get('/404',(req, res) => {
    res.status(404).send('not found');
})


function runServer(port = PORT) {
    const server = app
        .listen(port, () => {
            console.info(`App listening on port ${server.address().port}`);
        })
        .on('error', err => {
            console.error('Express failed to start');
            console.error(err);
        });
}

if (require.main === module) {
    dbConnect();
    runServer();
}

module.exports = { app };