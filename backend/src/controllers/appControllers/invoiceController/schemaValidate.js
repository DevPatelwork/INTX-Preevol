const Joi = require('joi');
const schema = Joi.object({
  client: Joi.alternatives().try(Joi.string(), Joi.object()).required(),
  number: Joi.number().required(),
  year: Joi.number().required(),
  status: Joi.string().required(),
  notes: Joi.string().allow(''),
  expiredDate: Joi.date().required(),
  date: Joi.date().required(),
  // array cannot be empty
  items: Joi.array()
    .items(
      Joi.object({
        _id: Joi.string().allow('').optional(),
        product: Joi.alternatives().try(Joi.string(), Joi.object()).optional(),
        itemName: Joi.string().required(),
        description: Joi.string().allow(''),
        quantity: Joi.number().required(),
        price: Joi.number().optional(),
        total: Joi.number().optional(),
      }).required()
    )
    .required(),
  taxRate: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
});

module.exports = schema;
