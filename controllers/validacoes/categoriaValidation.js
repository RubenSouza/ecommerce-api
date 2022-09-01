const Joi = require("joi");

const CategoriaValidation = {
  index: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
    }),
  },
  indexDisponiveis: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
    }),
  },
  show: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
    }),
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  store: {
    body: Joi.object({
      nome: Joi.string().required(),
      codigo: Joi.string().required(),
    }),
  },

  update: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),

    body: Joi.object({
      nome: Joi.string().required(),
      codigo: Joi.string().optional(),
      disponibilidade: Joi.boolean().optional(),
      produtos: Joi.array().items(
        Joi.string().alphanum().length(24).optional()
      ),
    }),
  },

  remove: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
};

module.exports = { CategoriaValidation };
