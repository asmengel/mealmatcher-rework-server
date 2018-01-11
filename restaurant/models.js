


const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const RestaurantSchema = mongoose.Schema({
  RestaurantName: {
    type: String,
    required: true
  },
  NumberOfReservations: {
      type: Number,
      required: true
      
  },
  UsersInterested:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]// required: [true,'No user id found']
  ,
  RestaurantId:{
    type: String,
    required: true
}

});

RestaurantSchema.methods.apiRepr = function () {
  return { 
   RestaurantName: this.RestaurantName,
   HasReservations: this.HasReservations,
   NumberOfReservations: this.NumberOfReservations,
   UsersInterested: this.UsersInterested,
   RestaurantId: this.RestaurantId,
    id: this._id };
};


const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', RestaurantSchema);

module.exports = { Restaurant };
