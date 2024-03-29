var mongoose =require('mongoose');

var Property= mongoose.model('Property',{

    address :{
        type : String
    },
    headline :{
        type : String
    },
    description: {
        type : String
    },
    bedroom: {
        type : String
            },
    bathroom :{
                type : String
            },
    accomodates :{
                type : String
            },
    amenities: {
                type : String
            },
    availableFrom: {
        type : String
    },
    availableTo :{
        type : String
    },
    propertyType :{
        type : String
    },
    bookingType: {
        type : String
    },
    currency: {
        type : String
            },
    baseRate :{
         type : String
            },
    owner: {
             type : String
            },
    images: {
                type : String
    },
    checkin: {
        type : String
            },
    checkout :{
         type : String
            },
    bookedBy: {
             type : String
            },
    bookedOnPrice: {
                type : Number
                 },
},"Property")

module.exports = {Property};