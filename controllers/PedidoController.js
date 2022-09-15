const mongoose = require("mongoose");

const Pedido = mongoose.model("Pedido");
const Produto = mongoose.model("Produto");
const Variacao = mongoose.model("Variacao");
const Pagamento = mongoose.model("Pagamento");
const Entrega = mongoose.model("Entrega");
const Cliente = mongoose.model("Cliente");
const RegistroPedido = mongoose.model("RegistroPedido");
const { calcularFrete } = require("./integracoes/correios");
const CarrinhoValidation = require("./validacoes/carrinhoValidation");
const EntregaValidation = require("./validacoes/entregaValidation");
const PagamentoValidation = require("./validacoes/pagamentoValidation");

class PedidoController {
  //ADMIN

  //get /admin indexAdmin
  async indexAdmin(req, res, next) {
    const { offset, limit, loja } = req.query;
    try {
      const pedidos = await Pedido.paginate(
        { loja },
        {
          offset: Number(offset || 0),
          limit: Number(limit || 30),
          populate: ["cliente", "pagamento", "entrega"],
        }
      );
      pedidos.docs = await Promise.all(
        pedidos.docs.map(async pedido => {
          pedido.carrinho = await Promise.all(
            pedido.carrinho.map(async item => {
              item.produto = await Produto.findById(item.produto);
              item.variacao = await Variacao.findById(item.variacao);
              return item;
            })
          );
          return pedido;
        })
      );
      return res.send({ pedidos });
    } catch (error) {
      next(error);
    }
  }

  //get /admin /:id showAdmin

  async showAdmin(req, res, next) {
    try {
      const pedido = await Pedido.findOne({
        loja: req.query.loja,
        _id: req.params.id,
      }).populate(["cliente", "pagamento", "entrega"]);

      pedido.carrinho = await Promise.all(
        pedido.carrinho.map(async item => {
          item.produto = await Produto.findById(item.produto);
          item.variacao = await Variacao.findById(item.variacao);
          return item;
        })
      );
      const registros = await RegistroPedido.find({ pedido: pedido._id });
      return res.send({ pedido, registros });
    } catch (error) {
      next(error);
    }
  }

  //delete /admin :id removeAdmin

  async removeAdmin(req, res, next) {
    try {
      const pedido = await Pedido.findOne({
        loja: req.query.loja,
        _id: req.params.id,
      });
      if (!pedido)
        return res.status(400).send({ error: "Pedido não encontrado" });
      pedido.cancelado = true;

      const registroPedido = new RegistroPedido({
        pedido: pedido._id,
        tipo: "pedido",
        situacao: "pedido_criado",
      });
      await registroPedido.save();
      // Registro de atividade = pedido cancelado
      // Enviar Email para cliente e Admin = pedido cancelado

      await pedido.save();
      return res.send({ cancelado: true });
    } catch (error) {
      next(error);
    }
  }

  //get /admin/:id/carrinho showCarrinhoPedidoAdmin

  async showCarrinhoPedidoAdmin(req, res, next) {
    try {
      const pedido = await Pedido.findOne({
        loja: req.query.loja,
        _id: req.params.id,
      });

      pedido.carrinho = await Promise.all(
        pedido.carrinho.map(async item => {
          item.produto = await Produto.findById(item.produto);
          item.variacao = await Variacao.findById(item.variacao);
          return item;
        })
      );
      return res.send({ carrinho: pedido.carrinho });
    } catch (error) {
      next(error);
    }
  }

  /* CLIENT */

  //get / index

  async index(req, res, next) {
    const { offset, limit, loja } = req.query;
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id });
      const pedidos = await Pedido.paginate(
        { loja, cliente: cliente._id },
        {
          offset: Number(offset || 0),
          limit: Number(limit || 30),
          populate: ["cliente", "pagamento", "entrega"],
        }
      );
      pedidos.docs = await Promise.all(
        pedidos.docs.map(async pedido => {
          pedido.carrinho = await Promise.all(
            pedido.carrinho.map(async item => {
              item.produto = await Produto.findById(item.produto);
              item.variacao = await Variacao.findById(item.variacao);
              return item;
            })
          );
          return pedido;
        })
      );
      return res.send({ pedidos });
    } catch (error) {
      next(error);
    }
  }

  //get /:id show

  async show(req, res, next) {
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id });
      const pedido = await Pedido.findOne({
        cliente: cliente._id,
        _id: req.params.id,
      }).populate(["cliente", "pagamento", "entrega"]);

      pedido.carrinho = await Promise.all(
        pedido.carrinho.map(async item => {
          item.produto = await Produto.findById(item.produto);
          item.variacao = await Variacao.findById(item.variacao);
          return item;
        })
      );
      const registros = await RegistroPedido.find({ pedido: pedido._id });

      return res.send({ pedido, registros });
    } catch (error) {
      next(error);
    }
  }

  //post / store

  async store(req, res, next) {
    const { carrinho, pagamento, entrega } = req.body;
    const { loja } = req.query;
    const _carrinho = carrinho.slice();

    try {
      //CHECAR OS DADOS DO CARRINHO

      if (!(await CarrinhoValidation(carrinho)))
        return res.status(422).send({ error: "Carrinho Inválido" });

      const cliente = await Cliente.findOne({
        usuario: req.payload.id,
      }).populate({ path: "usuario", select: "_id nome email" });

      //CHECAR DADOS DE ENTREGA

      if (
        !(await EntregaValidation.checarValorPrazo(
          cliente.endereco.CEP,
          carrinho,
          entrega
        ))
      )
        return res.status(422).send({ error: "Dados de entrega Inválidos" });

      // CHECAR DADOS DO PAGAMENTO
      if (
        !(await PagamentoValidation.checarValorTotal({
          carrinho,
          pagamento,
          entrega,
        }))
      )
        return res.status(422).send({ error: "Dados de pagamento Inválidos" });

      if (!PagamentoValidation.checarCartao(pagamento))
        return res
          .status(422)
          .send({ error: "Dados de pagamento com cartão Inválidos" });

      const novoPagamento = new Pagamento({
        valor: pagamento.valor,
        parcelas: pagamento.parcelas || 1,
        forma: pagamento.forma,
        status: "Iniciando",
        endereco: pagamento.endereco,
        cartao: pagamento.cartao,
        enderecoEntregaIgualCobranca: pagamento.enderecoEntregaIgualCobranca,
        loja,
      });
      const novaEntrega = new Entrega({
        status: "nao_iniciado",
        custo: entrega.custo,
        prazo: entrega.prazo,
        tipo: entrega.tipo,
        endereco: entrega.endereco,
        loja,
      });
      const pedido = new Pedido({
        cliente: cliente._id,
        carrinho: _carrinho,
        pagamento: novoPagamento._id,
        entrega: novaEntrega._id,
        loja,
      });
      novoPagamento.pedido = pedido._id;
      novaEntrega.pedido = pedido._id;

      await pedido.save();
      await novoPagamento.save();
      await novaEntrega.save();

      const registroPedido = new RegistroPedido({
        pedido: pedido._id,
        tipo: "pedido",
        situacao: "pedido_criado",
      });
      await registroPedido.save();
      //Notificar via email - cliente e admin = novo pedido

      return res.send({
        pedido: Object.assign({}, pedido._doc, {
          entrega: novaEntrega,
          pagamento: novoPagamento,
          cliente,
        }),
      });
    } catch (error) {
      next(error);
    }
  }

  //delete /:id remove

  async remove(req, res, next) {
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id });
      if (!cliente)
        return res.status(400).send({ error: "Cliente não encontrado" });
      const pedido = await Pedido.findOne({
        cliente: cliente._id,
        _id: req.params.id,
      });
      if (!pedido)
        return res.status(400).send({ error: "Pedido não encontrado" });
      pedido.cancelado = true;

      const registroPedido = new RegistroPedido({
        pedido: pedido._id,
        tipo: "pedido",
        situacao: "pedido_criado",
      });
      await registroPedido.save();

      // Registro de atividade = pedido cancelado
      // Enviar Email para o Admin = pedido cancelado

      await pedido.save();
      return res.send({ cancelado: true });
    } catch (error) {
      next(error);
    }
  }

  //get /:id/carrinho showCarrinhoPedido

  async showCarrinhoPedido(req, res, next) {
    try {
      const cliente = await Cliente.findOne({ usuario: req.payload.id });
      const pedido = await Pedido.findOne({
        cliente: cliente._id,
        _id: req.params.id,
      });

      pedido.carrinho = await Promise.all(
        pedido.carrinho.map(async item => {
          item.produto = await Produto.findById(item.produto);
          item.variacao = await Variacao.findById(item.variacao);
          return item;
        })
      );
      return res.send({ carrinho: pedido.carrinho });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PedidoController;
