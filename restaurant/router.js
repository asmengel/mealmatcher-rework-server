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