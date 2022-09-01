const Joi = require("joi");

const AvaliacaoValidation = {
  index: {
    query: Joi.object({
      produto: Joi.string().alphanum().length(24).required(),
      loja: Joi.string().alphanum().length(24).required(),
    }),
  },

  show: {
    query: Joi.object({
      produto: Joi.string().alphanum().length(24).required(),
      loja: Joi.string().alphanum().length(24).required(),
    }),
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  store: {
    query: Joi.object({
      produto: Joi.string().alphanum().length(24).required(),
      loja: Joi.string().alphanum().length(24).required(),
    }),

    body: Joi.object({
      nome: Joi.string().required(),
      texto: Joi.string().required(),
      pontuacao: Joi.number().min(1).max(5).required(),
    }),
  },

  remove: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
};

module.exports = {
  AvaliacaoValidation,
};
