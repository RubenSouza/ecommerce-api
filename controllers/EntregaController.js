const mongoose = require("mongoose");
const Entrega = mongoose.model("Entrega");
const Produto = mongoose.model("Produto");
const Variacao = mongoose.model("Variacao");
const RegistroPedido = mongoose.model("RegistroPedido");

const { calcularFrete } = require("./integracoes/correios");

class EntregaController {
  //GET /:ID show

  async show(req, res, next) {
    try {
      const entrega = await Entrega.findOne({
        _id: req.params.id,
        loja: req.query.loja,
      });
      const registros = await RegistroPedido.find({
        pedido: entrega.pedido,
        tipo: "entrega",
      });
      return res.send({ entrega, registros });
    } catch (error) {
      next(error);
    }
  }

  //PUT /:id

  async update(req, res, next) {
    const { status, codigoRastreamento } = req.body;
    const { loja } = req.query;
    try {
      const entrega = await Entrega.findOne({ loja, _id: req.params.id });
      if (status) entrega.status = status;
      if (codigoRastreamento) entrega.codigoRastreamento = codigoRastreamento;
      const registroPedido = new RegistroPedido({
        pedido: entrega.pedido,
        tipo: "entrega",
        situacao: status,
        payload: req.body,
      });
      await registroPedido.save();
      //Enviar email de aviso para o cliente sobre a atualização de entrega
      await entrega.save();
      return res.send({ entrega });
    } catch (error) {
      next(error);
    }
  }
  //POST / calcular

  async calcular(req, res, next) {
    const { cep, carrinho } = req.body;
    try {
      const _carrinho = await Promise.all(
        carrinho.map(async item => {
          item.produto = await Produto.findById(item.produto);
          item.variacao = await Variacao.findById(item.variacao);
          return item;
        })
      );
      const resultados = await calcularFrete({ cep, produtos: _carrinho });
      return res.send({ resultados });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EntregaController;
