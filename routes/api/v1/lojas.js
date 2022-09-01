const router = require("express").Router();
const auth = require("../../auth");

const { validate } = require("express-validation");
const {
  LojaValidation,
} = require("../../../controllers/validacoes/lojaValidation");

const LojaController = require("../../../controllers/LojaController");

const lojaController = new LojaController();

router.get("/", lojaController.index);
router.get("/:id", validate(LojaValidation.show), lojaController.show);

router.post(
  "/",
  auth.required,
  validate(LojaValidation.store),
  lojaController.store
);
router.put(
  "/:id",
  auth.required,
  LojaValidation.admin,
  validate(LojaValidation.update),
  lojaController.update
);
router.delete(
  "/:id",
  auth.required,
  LojaValidation.admin,
  lojaController.remove
);

module.exports = router;
