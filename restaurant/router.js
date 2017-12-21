// api/restaurant

const express = require('express');
const router = express.Router();
const { Restaurant } = require('./models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const {basicAuth, jwtAuth} = require('../auth/strategies');
router.get('/reservations',(req, res) => {
return {
    RestaurantName: 'dummy brew house',
    HasReservations: true,
    NumberOfReservations: 5,
    UsersInterested: [
        catbandit,
        catbandit1
    ]

}
});
// router.get('/join/', jwtAuth, (req, res) => {
//     res.json(200).find({
//         user: res.body.user
//     })
// })
// not sure why this does not work $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
router.post('/reservations', jsonParser, (req, res) => {
    let restaurants = {};
    let {RestaurantName, HasReservations, NumberOfReservations, UsersInterested} = restaurants;
    return Restaurant.create({RestaurantName, HasReservations, NumberOfReservations, UsersInterested})
    .then(restaurants => {
        return res.status(201).json(restaurants.apiRepr())
    })
    .catch(err => {
          res.status(500).json({ code: 500, message: 'Internal server error' });
    })
})
router.get('/join/:id', jwtAuth, (req, res) => {
    Restaurant.findOneAndUpdate({
        _id: req.params.id
    }, {
        $addToSet:{UsersInterested: req.user._id}
    }).then(restaurant => {
        res.json(restaurant)
    }).catch(err => {
        res.status(500).json(err)
    })
})

module.exports = { router };