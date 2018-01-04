// api/restaurant

const express = require('express');
const router = express.Router();
const { Restaurant } = require('./models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);
const { basicAuth, jwtAuth } = require('../auth/strategies');
router.get('/info/:id', (req, res) => {
    return Restaurant.findOne({RestaurantId: req.params.id})
        .then(restaurant => {
            if(!restaurant){
                return res.sendStatus(404)
            }
            return res.status(200).json(restaurant.apiRepr())

        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ code: 500, message: 'internal server error' });
        });
})
// router.get('/join/', jwtAuth, (req, res) => {
//     res.json(200).find({
//         user: res.body.user
//     })
// })
// not sure why this does not work $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//router.post('/reservations/:id', jwtAuth, (req, res) => {
    // console.log('endpoint hit', req)

//     let restaurant = {};
//     //let { RestaurantName, HasReservations, UsersInterested, NumberOfReservations} = restaurant;
//     console.log(restaurant);
//     return Restaurant.create({
//         RestaurantName: req.body.RestaurantName, HasReservations: req.body.HasReservations,
//         NumberOfReservations: req.body.NumberOfReservations, UsersInterested: [req.user._id], RestaurantId: req.body.RestaurantId
//     })

//         .then(restaurant => {
//             console.log(restaurant, 'does the promise fire');
//             return res.status(201).json(restaurant.apiRepr());
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({ code: 500, message: 'internal server error' });
//         });
// });
// /join/:id
router.post('/reservations/:id', jwtAuth, (req, res) => {
    Restaurant.findOneAndUpdate({
        RestaurantId: req.params.id
    }, {
            $set: req.body,
            $addToSet: { UsersInterested: req.user._id }
        }, 
        {
            upsert:true
        }).then(restaurant => {
            res.json(restaurant)
        }).catch(err => {
            res.status(500).json(err)
            console.log(err);
        })
})

module.exports = { router };