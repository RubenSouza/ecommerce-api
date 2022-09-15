const BaseJoi = require("joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);

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
        parcelas: Joi.number().optional(),
        enderecoEntregaIgualCobranca: Joi.boolean().required(),
        endereco: Joi.object({
          local: Joi.string().required(),
          numero: Joi.string().required(),
          complemento: Joi.string().optional(),
          bairro: Joi.string().required(),
          cidade: Joi.string().required(),
          estado: Joi.string().required(),
          CEP: Joi.string().required(),
        }).required(),
        cartao: Joi.object({
          nomeCompleto: Joi.string().required(),
          codigoArea: Joi.string().required(),
          telefone: Joi.string().required(),
          dataDeNascimento: Joi.date().format("DD/MM/YYYY").raw().required(),
          credit_card_token: Joi.string().required(),
          cpf: Joi.string().required(),
        }).optional(),
      }).required(),
      //ENTREGA
      entrega: Joi.object({
        custo: Joi.number().required(),
        tipo: Joi.string().required(),
        prazo: Joi.number().required(),
        endereco: Joi.object({
          local: Joi.string().required(),
          numero: Joi.string().required(),
          complemento: Joi.string().optional(),
          bairro: Joi.string().required(),
          cidade: Joi.string().required(),
          estado: Joi.string().required(),
          CEP: Joi.string().required(),
        }).required(),
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
