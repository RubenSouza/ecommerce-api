const router = require("express").Router();

const CategoriaController = require("../../../controllers/CategoriaController");
const auth = require("../../auth");
const { validate } = require("express-validation");
const {
  LojaValidation,
} = require("../../../controllers/validacoes/lojaValidation");
const {
  CategoriaValidation,
} = require("../../../controllers/validacoes/categoriaValidation");

const categoriaController = new CategoriaController();

router.get("/", validate(CategoriaValidation.index), categoriaController.index);
router.get(
  "/disponiveis",
  validate(CategoriaValidation.indexDisponiveis),
  categoriaController.indexDisponiveis
);
router.get(
  "/:id",
  validate(CategoriaValidation.show),
  categoriaController.show
);

router.post(
  "/",
  auth.required,
  LojaValidation.admin,
  validate(CategoriaValidation.store),
  categoriaController.store
);
router.put(
  "/:id",
  auth.required,
  LojaValidation.admin,
  validate(CategoriaValidation.update),
  categoriaController.update
);
router.delete(
  "/:id",
  auth.required,
  LojaValidation.admin,
  validate(CategoriaValidation.remove),
  categoriaController.remove
);

//ROTAS AO PRODUTO - em breve

router.get("/:id/produtos", categoriaController.showProdutos);
router.put(
  "/:id/produtos",
  auth.required,
  LojaValidation.admin,
  categoriaController.updateProdutos
);

module.exports = router;
