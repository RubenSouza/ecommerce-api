const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

const ProdutoValidation = {
  store: {
    body: Joi.object({
      titulo: Joi.string().required(),
      descricao: Joi.string().required(),
      categoria: Joi.string().alphanum().length(24).required(),
      preco: Joi.number().required(),
      promocao: Joi.number(),
      sku: Joi.string().required(),
    }),
  },
  update: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object({
      titulo: Joi.string().optional(),
      descricao: Joi.string().optional(),
      categoria: Joi.string().alphanum().length(24).optional(),
      preco: Joi.number().optional(),
      promocao: Joi.number(),
      sku: Joi.string().optional(),
      disponibilidade: Joi.boolean().optional(),
    }),
  },

  updateImages: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  remove: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  index: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
      limit: Joi.number(),
      offset: Joi.number(),
      sortType: Joi.string(),
    }),
  },

  indexDisponiveis: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
      limit: Joi.number(),
      offset: Joi.number(),
      sortType: Joi.string(),
    }),
  },

  search: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
      limit: Joi.number(),
      offset: Joi.number(),
      sortType: Joi.string(),
    }),
    params: Joi.object({
      search: Joi.string().required(),
    }),
  },

  show: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
  showAvaliacoes: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
  showVariacoes: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
};

module.exports = {
  ProdutoValidation,
};
