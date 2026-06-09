const Joi = require('joi');


//server side validation for listing schema
module.exports.listingSchema=Joi.object({
    listing : Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.number().required().min(0), //price cannot be negative
        image: Joi.object({
            url: Joi.string().allow("", null) //can be empty or null as default image is present in mongoose schema
        }), 
    }).required(),
});


//server side validation for review schema
module.exports.reviewSchema=Joi.object({
    review: Joi.object({
        rating:Joi.number().min(1).max(5).required(),
        comment:Joi.string().required(),
    }).required()
});