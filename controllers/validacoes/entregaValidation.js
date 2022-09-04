const Joi = require("joi");
const mongoose = require("mongoose");
const Produto = mongoose.model("Produto");
const Variacao = mongoose.model("Variacao");
const { calcularFrete } = require("../integracoes/correios");

const EntregaValidation = {
  show: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
    }),
  },
  update: {
    params: Joi.object({
      id: Joi.string().alphanum().length(24).required(),
    }),
    query: Joi.object({
      loja: Joi.string().alphanum().length(24).required(),
    }),
    body: Joi.object({
      status: Joi.string().optional(),
      codigoRastreamento: Joi.string().optional(),
    }),
  },
  calcular: {
    body: Joi.object({
      cep: Joi.string().required(),
      carrinho: Joi.array()
        .items(
          Joi.object({
            produto: Joi.string().alphanum().length(24).required(),
            variacao: Joi.string().alphanum().length(24).required(),
            precoUnitario: Joi.number().optional(),
            quantidade: Joi.number().optional(),
          })
        )
        .required(),
    }),
  },
};

const checarValorPrazo = async (cep, carrinho, entrega) => {
  try {
    const _carrinho = await Promise.all(
      carrinho.map(async item => {
        item.produto = await Produto.findById(item.produto);
        item.variacao = await Variacao.findById(item.variacao);
        return item;
      })
    );
    const resultados = await calcularFrete({ cep, produtos: _carrinho });
    let found = false;
    resultados.forEach(resultado => {
      if (
        resultado.Codigo.toString() === entrega.tipo &&
        Number(resultado.Valor.replace(/,/g, ".")) === entrega.custo &&
        resultado.PrazoEntrega === entrega.prazo.toString()
      )
        found = true;
    });

    return found;
  } catch (error) {
    console.log(error);
    return false;
  }
};
module.exports = { EntregaValidation, checarValorPrazo };
