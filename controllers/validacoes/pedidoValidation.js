const Joi = require("joi");

const PedidoValidation = {
  //ADMIN
  indexAdmin: {
    query: Joi.object({
      offset: Joi.number().required(),
      limit: Joi.number().required(),
      loja: Joi.string().alphanum().length(24).required(),
    }),
  },
  showAdmin: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
  removeAdmin: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
  showCarrinhoPedidoAdmin: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  //CLIENTE

  index: {
    query: Joi.object({
      offset: Joi.number().required(),
      limit: Joi.number().required(),
      loja: Joi.string().alphanum().length(24).required(),
    }),
  },

  show: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  store: {
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object({
      //CARRINHO
      carrinho: Joi.array()
        .items(
          Joi.object({
            produto: Joi.string().alphanum().length(24).required(),
            variacao: Joi.string().alphanum().length(24).required(),
            precoUnitario: Joi.number().required(),
            quantidade: Joi.number().required(),
          })
        )
        .required(),
      //PAGAMENTO
      pagamento: Joi.object({
        valor: Joi.number().required(),
        forma: Joi.string().required(),
      }).required(),
      //ENTREGA
      entrega: Joi.object({
        custo: Joi.number().required(),
        tipo: Joi.string().required(),
        prazo: Joi.number().required(),
      }).required(),
    }),
  },

  remove: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },

  showCarrinhoPedido: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
  },
};

module.exports = { PedidoValidation };
