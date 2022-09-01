const Joi = require("joi");

const VariacaoValidation = {
  index: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
      produto: Joi.string().alphanum().length(24).required(),
    }),
  },
  show: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
      produto: Joi.string().alphanum().length(24).required(),
    }),
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
  store: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
      produto: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object({
      codigo: Joi.string().required(),
      nome: Joi.string().required(),
      preco: Joi.number().required(),
      promocao: Joi.number().optional(),
      entrega: Joi.object({
        dimensoes: Joi.object({
          alturaCm: Joi.number().required(),
          larguraCm: Joi.number().required(),
          profundidadeCm: Joi.number().required(),
        }).required(),
        pesoKg: Joi.number().required(),
        freteGratis: Joi.boolean().optional(),
      }).required(),
      quantidade: Joi.number().optional(),
    }),
  },
  update: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
      produto: Joi.string().alphanum().length(24).required(),
    }),
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object({
      codigo: Joi.string().optional(),
      nome: Joi.string().optional(),
      preco: Joi.number().optional(),
      promocao: Joi.number().optional(),
      disponibilidade: Joi.boolean().optional(),
      entrega: Joi.object({
        dimensoes: Joi.object({
          alturaCm: Joi.number().required(),
          larguraCm: Joi.number().required(),
          profundidadeCm: Joi.number().required(),
        }).required(),
        pesoKg: Joi.number().required(),
        freteGratis: Joi.boolean().optional(),
      }).optional(),
      quantidade: Joi.number().optional(),
    }),
  },
  updateImages: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
      produto: Joi.string().alphanum().length(24).required(),
    }),
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
  remove: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
      produto: Joi.string().alphanum().length(24).required(),
    }),
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
};

module.exports = {
  VariacaoValidation,
};
