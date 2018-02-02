const request = require('request');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios= require('axios');
const { PORT, CLIENT_ORIGIN, KEY, GEO_KEY, PLACES_KEY, DATABASE_URL} = require('./config');
const { dbConnect } = require('./db-mongoose');


const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const passport = require('passport');
const { router: authRouter, basicStrategy, jwtStrategy } = require('./auth');
const { router: usersRouter } = require('./users');
const { router: restaurantRouter} = require('./restaurant');
passport.use(basicStrategy);
passport.use(jwtStrategy);
const app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Request-Headers");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// endpoints
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/restaurant/', restaurantRouter);

// non db endpoints
app.get('/googleplaces', (req, res) => {
    console.log('googleplacesbackend', `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.query.location}&radius=15&type=restaurant&key=${PLACES_KEY}`);
    let options = {
        url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${req.query.location}&radius=75&type=restaurant&key=${PLACES_KEY}`
    }
    request(options, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            let info = JSON.parse(body);
             return res.json(info)
        }
        
    })
})

// retrieves image from google for front end render
app.get('/placesphoto', (req, res) => {
    let options ={
        url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=350&photoreference=${req.query.photoreference}&maxheight=350&key=${PLACES_KEY}
        `,
        
        
    }
    request(options.url).pipe(res)

})
// geocodes city submitted by user
app.get('/geocode', (req, res) => {
    let options ={
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.search}&key=${GEO_KEY}
        `,
        
    }
    request(options, function(error, response, body) {
        if(!error && response.statusCode == 200) {
            let info = JSON.parse(body);
            res.json(info);
        }
    })

})




app.get('/searchresults', (req, res) =>  {
    // console.log(`https://developers.zomato.com/api/v2.1/search?lat=${req.query.lat}&lon=${req.query.lng}&radius=${parseInt(req.query.miles)*1609.34}`)
    let options = {
        url: `https://developers.zomato.com/api/v2.1/search?lat=${req.query.lat}&lon=${req.query.lng}&radius=${parseInt(req.query.miles)*1609.34}`,
        headers: {
            'Accept': 'application/json',
            'user-key': KEY
        }
    }
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            let info = JSON.parse(body);
            res.json(info);
            
        }
    
    
    
        
        })
    });




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
// let server;


function runServer(url = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(url, { useMongoClient: true }, err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }

  
// function runServer(port = PORT, dbURL = DATABASE_URL) {
//     dbConnect();
//     const server = app
//         .listen(port, () => {
//             console.info(`App listening on port ${server.address().port}`);
//         })
//         .on('error', err => {
//             console.error('Express failed to start');
//             console.error(err);
//         });
// }

if (require.main === module) {
    dbConnect();
    runServer();
}
// for testing
function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }

module.exports = { app, runServer, closeServer };