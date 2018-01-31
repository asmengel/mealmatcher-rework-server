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
        .populate("UsersInterested")
        .then(restaurant => {
            if(!restaurant){
                return res.sendStatus(404)
            }
            console.log(restaurant.apiRepr())
            return res.status(200).json(restaurant.apiRepr())

        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({ code: 500, message: 'internal server error' });
        });
})


router.post('/reservations/:id', jwtAuth, (req, res) => {
    console.log(req.body)
    Restaurant.findOneAndUpdate({
        RestaurantId: req.params.id,
          
    }, {
            $set: req.body 
            ,
            $inc: {
                NumberOfReservations: 1
            },
            $addToSet: { 
                UsersInterested: req.user.id,    
             }
        }, 
        {
            upsert:true,
            new: true,
            populate: "UsersInterested"
        }).then(restaurant => {
            res.status(200).json(restaurant)
        }).catch(err => {
            res.status(500).json(err)
            console.log(err);
        })
})

module.exports = { router };