const mongoose = require("mongoose");
const Loja = mongoose.model("Loja");

class LojaController {
  //GET

  index(req, res, next) {
    Loja.find({})
      .select("_id nome cpnj email telefones endereco")
      .then(lojas => {
        res.send({ lojas });
      })
      .catch(next);
  }

  //GET /:id

  show(req, res, next) {
    Loja.findById(req.params.id)
      .select("_id nome cpnj email telefones endereco")
      .then(loja => {
        res.send({ loja });
      })
      .catch(next);
  }

  //POST

  store(req, res, next) {
    const { nome, cpnj, email, telefones, endereco } = req.body;
    const loja = new Loja({ nome, cpnj, email, telefones, endereco });
    loja
      .save()
      .then(() => {
        res.send({ loja });
      })
      .catch(next);
  }

  //PUT /:id

  update(req, res, next) {
    const { nome, cpnj, email, telefones, endereco } = req.body;
    Loja.findById(req.query.loja)
      .then(loja => {
        if (!loja) return res.status(422).send({ error: "Loja não existe" });

        if (nome) loja.nome = nome;
        if (cpnj) loja.cpnj = cpnj;
        if (email) loja.email = email;
        if (telefones) loja.telefones = telefones;
        if (endereco) loja.endereco = endereco;

        loja
          .save()
          .then(() => {
            res.send({ loja });
          })
          .catch(next);
      })
      .catch(next);
  }

  //DELETE /:id

  remove(req, res, next) {
    Loja.findById(req.query.loja)
      .then(loja => {
        if (!loja) return res.status(422).send({ error: "Loja não existe" });

        loja
          .remove()
          .then(() => {
            res.send({ deleted: true });
          })
          .catch(next);
      })
      .catch(next);
  }
}

module.exports = LojaController;
