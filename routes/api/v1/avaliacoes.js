const router = require("express").Router();
const AvaliacaoController = require("../../../controllers/AvaliacaoController");
const { validate } = require("express-validation");
const {
  LojaValidation,
} = require("../../../controllers/validacoes/lojaValidation");
const {
  AvaliacaoValidation,
} = require("../../../controllers/validacoes/avaliacaoValidation");
const auth = require("../../auth");

const avaliacaoController = new AvaliacaoController();

//CLIENTES/ VISITANTES

router.get("/", validate(AvaliacaoValidation.index), avaliacaoController.index);
router.get(
  "/:id",
  validate(AvaliacaoValidation.show),
  avaliacaoController.show
);
router.post(
  "/",
  auth.required,
  validate(AvaliacaoValidation.store),
  avaliacaoController.store
);

//ADMIN

router.delete(
  "/:id",
  auth.required,
  LojaValidation.admin,
  validate(AvaliacaoValidation.remove),
  avaliacaoController.remove
);

module.exports = router;
