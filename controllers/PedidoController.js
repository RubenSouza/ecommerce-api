const mongoose = require("mongoose");

const Pedido = mongoose.model("Pedido");
const Produto = mongoose.model("Produto");
const Variacao = mongoose.model("Variacao");
const Pagamento = mongoose.model("Pagamento");
const Entrega = mongoose.model("Entrega");
const Cliente = mongoose.model("Cliente");
const RegistroPedido = mongoose.model("RegistroPedido");

const CarrinhoValidation = require("./validacoes/carrinhoValidation");
// const EntregaValidation = require("./validacoes/entregaValidation")

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

    try {
      //CHECAR OS DADOS DO CARRINHO

      if (!(await CarrinhoValidation(carrinho)))
        return res.status(422).send({ error: "Carrinho Inválido" });

      //CHECAR DADOS DE ENTREGA
      //if (!EntregaValidation(carrinho, entrega))
      //return res.status(422).send({ error: "Dados de entrega Inválidos" });
      // CHECAR DADOS DO PAGAMENTO
      //if (!PagamentoValidation(carrinho, pagamento))
      //return res.status(422).send({ error: "Dados de pagamento Inválidos" });

      const cliente = await Cliente.findOne({ usuario: req.payload.id });

      const novoPagamento = new Pagamento({
        valor: pagamento.valor,
        forma: pagamento.forma,
        status: "Iniciando",
        payload: pagamento,
        loja,
      });
      const novaEntrega = new Entrega({
        status: "nao_iniciado",
        custo: entrega.custo,
        prazo: entrega.prazo,
        tipo: entrega.tipo,
        payload: entrega,
        loja,
      });
      const pedido = new Pedido({
        cliente: cliente._id,
        carrinho,
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
