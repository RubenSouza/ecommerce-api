const router = require("express").Router();
const auth = require("../../auth");

const {
  LojaValidation,
} = require("../../../controllers/validacoes/lojaValidation");
const {
  ClienteValidation,
} = require("../../../controllers/validacoes/clienteValidation");
const { validate } = require("express-validation");

const ClienteController = require("../../../controllers/ClienteController");
const clienteController = new ClienteController();

//ADMIN

router.get(
  "/",
  auth.required,
  LojaValidation.admin,
  validate(ClienteValidation.index, {}, {}),
  clienteController.index
);
router.get(
  "/search/:search/pedidos",
  auth.required,
  LojaValidation.admin,
  validate(ClienteValidation.searchPedidos, {}, {}),
  clienteController.searchPedidos
);
router.get(
  "/search/:search",
  auth.required,
  LojaValidation.admin,
  validate(ClienteValidation.search, {}, {}),
  clienteController.search
);
router.get(
  "/admin/:id",
  auth.required,
  LojaValidation.admin,
  validate(ClienteValidation.showAdmin, {}, {}),
  clienteController.showAdmin
);
router.get(
  "/admin/:id/pedidos",
  auth.required,
  LojaValidation.admin,
  validate(ClienteValidation.showPedidosCliente, {}, {}),
  clienteController.showPedidosCliente
);
router.put(
  "/admin/:id",
  auth.required,
  LojaValidation.admin,
  validate(ClienteValidation.updateAdmin, {}, {}),
  clienteController.updateAdmin
);

//Cliente

router.get(
  "/:id",
  auth.required,
  validate(ClienteValidation.show, {}, {}),
  clienteController.show
);
router.post(
  "/",
  validate(ClienteValidation.store, {}, {}),
  clienteController.store
);
router.put(
  "/:id",
  auth.required,
  validate(ClienteValidation.update, {}, {}),
  clienteController.update
);
router.delete("/:id", auth.required, clienteController.remove);

module.exports = router;
