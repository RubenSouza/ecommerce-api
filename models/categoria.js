const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const CategoriaSchema = Schema(
  {
    nome: { type: String, required: true },
    codigo: { type: String, required: true },
    disponibilidade: { type: Boolean, required: true, default: true },
    produtos: { type: [{ type: Schema.Types.ObjectId, ref: "Produto" }] },
    loja: { type: Schema.Types.ObjectId, ref: "Produto" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categoria", CategoriaSchema);
