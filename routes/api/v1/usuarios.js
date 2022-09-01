const router = require("express").Router();
const auth = require("../../auth");
const UsuarioController = require("../../../controllers/UsuarioController");

const { validate } = require("express-validation");

const {
  UsuarioValidation,
} = require("../../../controllers/validacoes/usuarioValidation");
const usuarioController = new UsuarioController();

router.post(
  "/login",
  validate(UsuarioValidation.login, {}, {}),
  usuarioController.login
); //testado
router.post(
  "/registrar",
  validate(UsuarioValidation.store, {}, {}),
  usuarioController.store
); //testado
router.put(
  "/",
  auth.required,
  validate(UsuarioValidation.update, {}, {}),
  usuarioController.update
); //testado
router.delete("/", auth.required, usuarioController.remove); //testado

router.get("/recuperar-senha", usuarioController.showRecovery);
router.post("/recuperar-senha", usuarioController.createRecovery);
router.get("/senha-recuperada", usuarioController.showCompleteRecovery);
router.post("/senha-recuperada", usuarioController.completeRecovery);

router.get("/", auth.required, usuarioController.index); //testado
router.get(
  "/:id",
  auth.required,
  validate(UsuarioValidation.show, {}, {}),
  usuarioController.show
); //testado

module.exports = router;
