const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const UsuarioValidation = {
  show: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  store: {
    body: Joi.object({
      nome: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      loja: Joi.string().alphanum().length(24).required(),
    }),
  },

  update: {
    body: Joi.object({
      nome: Joi.string().optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().optional(),
    }),
  },

  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
};

module.exports = {
  UsuarioValidation,
};
