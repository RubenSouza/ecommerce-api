const pagSeguroConfig = require("../../config/pagseguro");
const PagSeguro = require("../../helpers/pagseguro");

const _criarPagamentoComBoleto = (
  senderHash,
  { cliente, carrinho, entrega, pagamento }
) => {
  return new Promise((resolve, reject) => {
    const pag = new PagaSeguro(pagSeguroConfig);
    pag.setSender({
      name: cliente.nome,
      email: cliente.usuario.email,
      cpf_cnpj: cliente.cpf.replace(/[-\.]/g, ""),
      area_code: cliente.telefones[0].slice(0, 2),
      phone: cliente.telefones[0].slice(2).trim(),
      birth_date: cliente.dataDeNascimento, /// formato DD//MM/YYYY
    });
    pag.setShippin({
      street: entrega.endereco.local,
      number: entrega.endereco.numero,
      district: entrega.endereco.bairro,
      city: entrega.endereco.cidade,
      state: entrega.endereco.estado,
      postal_code: entrega.endereco.CEP.replace(/-/g, ""),
      same_for_billing: pagamento.enderecoEntregaIgualCobranca, // true or false
    });
    pag.setBilling({
      street: pagamento.endereco.local,
      number: pagamento.endereco.numero,
      district: pagamento.endereco.bairro,
      city: pagamento.endereco.cidade,
      state: pagamento.endereco.estado,
      postal_code: pagamento.endereco.CEP.replace(/-/g, ""),
    });

    carrinho.forEach(item => {
      pag.addItem({
        qtde: item.quantidade,
        value: item.precoUnitario,
        description: `${item.produto.titulo} - ${item.variacao.nome}`,
      });
    });
    pag.addItem({
      qtde: 1,
      value: entrega.custo,
      description: "Custo de Entrega - Correios",
    });

    pag.sendTransaction(
      {
        method: "boleto",
        value: pagamento.valor,
        installments: 1,
        hash: senderHash,
      },
      (error, data) => (error ? reject(error) : resolve(data))
    );
  });
};
const _criarPagamentoComCartao = (senderHash, data) => {
  return new Promise((resolve, reject) => {
    const pag = new PagaSeguro(pagSeguroConfig);
    pag.setSender({
      name: cliente.nome,
      email: cliente.usuario.email,
      cpf_cnpj: cliente.cpf.replace(/[-\.]/g, ""),
      area_code: cliente.telefones[0].slice(0, 2),
      phone: cliente.telefones[0].slice(2).trim(),
      birth_date: cliente.dataDeNascimento, /// formato DD//MM/YYYY
    });
    pag.setShippin({
      street: entrega.endereco.local,
      number: entrega.endereco.numero,
      district: entrega.endereco.bairro,
      city: entrega.endereco.cidade,
      state: entrega.endereco.estado,
      postal_code: entrega.endereco.CEP.replace(/-/g, ""),
      same_for_billing: pagamento.enderecoEntregaIgualCobranca, // true or false
    });
    pag.setBilling({
      street: pagamento.endereco.local,
      number: pagamento.endereco.numero,
      district: pagamento.endereco.bairro,
      city: pagamento.endereco.cidade,
      state: pagamento.endereco.estado,
      postal_code: pagamento.endereco.CEP.replace(/-/g, ""),
    });

    carrinho.forEach(item => {
      pag.addItem({
        qtde: item.quantidade,
        value: item.precoUnitario,
        description: `${item.produto.titulo} - ${item.variacao.nome}`,
      });
    });
    pag.addItem({
      qtde: 1,
      value: entrega.custo,
      description: "Custo de Entrega - Correios",
    });

    pag.setCreditCardHolder({
      name: pagamento.cartao.nomeCompleto || cliente.nome,
      area_code:
        pagamento.cartao.codigoArea.trim() || cliente.telefones[0].slice(0, 2),
      phone:
        pagamento.cartao.codigoArea.trim() || cliente.telefones[0].slice(2),
      birth_date: pagamento.cartao.dataDeNascimento || cliente.dataDeNascimento,
      cpf_cnpj: (pagamento.cartao.cpf || cliente.cpf).replace(/[-\.]/g, ""),
    });

    pag.sendTransaction(
      {
        method: "creditCard",
        value:
          pagamento.valor % 2 !== 0 && pagamento.parcelas !== 1
            ? pagamento.valor + 0.01
            : pagamento.valor,
        installments: pagamento.parcelas,
        hash: senderHash,
        credit_card_token: pagamento.cartao.credit_card_token,
      },
      (error, data) => (error ? reject(error) : resolve(data))
    );
  });
};

const criarPagamento = async (senderHash, data) => {
  try {
    if (data.pagamento.forma === "boleto") {
      return await _criarPagamentoComBoleto(senderHash, data);
    } else if (data.pagamento.forma === "creditCard") {
      return await _criarPagamentoComCartao(senderHash, data);
    } else return { errorMessage: "Forma de pagamento não encontrada." };
  } catch (error) {
    console.log(error);
    return { errorMessage: "Ocorreu um erro", errors: error };
  }
};

const getSessionId = () => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.sessionId((error, session_id) =>
      error ? reject(error) : resolve(session_id)
    );
  });
};

const getTransactionStatus = codigo => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.transactionStatus(codigo, (error, result) =>
      error ? reject(error) : resolve(result)
    );
  });
};

const getNotification = codigo => {
  return new Promise((resolve, reject) => {
    const pag = new PagSeguro(pagSeguroConfig);
    pag.getNotification(codigo, (error, result) =>
      error ? reject(error) : resolve(result)
    );
  });
};

module.exports = {
  criarPagamento,
  getSessionId,
  getTransactionStatus,
  getNotification,
};
