const router = require("express").Router();

const VariacaoController = require("../../../controllers/VariacaoController");
const {
  LojaValidation,
} = require("../../../controllers/validacoes/lojaValidation");
const auth = require("../../auth");
const upload = require("../../../config/multer");
const {
  VariacaoValidation,
} = require("../../../controllers/validacoes/variacaoValidation");
const { validate } = require("express-validation");

const variacaoController = new VariacaoController();

router.get("/", validate(VariacaoValidation.index), variacaoController.index);
router.get("/:id", validate(VariacaoValidation.show), variacaoController.show);
router.post(
  "/",
  auth.required,
  LojaValidation.admin,
  validate(VariacaoValidation.store),
  variacaoController.store
);
router.put(
  "/:id",
  auth.required,
  LojaValidation.admin,
  validate(VariacaoValidation.update),
  variacaoController.update
);
router.put(
  "/images/:id",
  auth.required,
  LojaValidation.admin,
  validate(VariacaoValidation.updateImages),
  upload.array("files", 4),
  variacaoController.updateImages
);

router.delete(
  "/:id",
  auth.required,
  LojaValidation.admin,
  validate(VariacaoValidation.remove),
  variacaoController.remove
);

module.exports = router;
