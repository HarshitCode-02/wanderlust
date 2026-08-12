const Joi = require('joi');

module.exports.listingschema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        Description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        title: Joi.string().allow("",null),

    }).required()
});