const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const LojaSchema = mongoose.Schema(
  {
    nome: { type: String, required: true },
    cpnj: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    telefones: {
      type: [{ type: String }],
    },
    endereco: {
      type: {
        local: { type: String, required: true },
        numero: { type: String, required: true },
        completemento: { type: String },
        bairro: { type: String, required: true },
        cidade: { type: String, required: true },
        CEP: { type: String, required: true },
      },
      required: true,
    },
  },
  { timestamps: true }
);

LojaSchema.plugin(uniqueValidator, { message: "Já está sendo utilizado" });

module.exports = mongoose.model("Loja", LojaSchema);
