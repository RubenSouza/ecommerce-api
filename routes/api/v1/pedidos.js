const router = require("express").Router();
const PedidoController = require("../../../controllers/PedidoController");
const {
  LojaValidation,
} = require("../../../controllers/validacoes/lojaValidation");
const {
  PedidoValidation,
} = require("../../../controllers/validacoes/pedidoValidation");
const { validate } = require("express-validation");
const auth = require("../../auth");

const pedidoController = new PedidoController();

//ADMIN

router.get(
  "/admin",
  auth.required,
  LojaValidation.admin,
  validate(PedidoValidation.indexAdmin),
  pedidoController.indexAdmin
);
router.get(
  "/admin/:id",
  auth.required,
  LojaValidation.admin,
  validate(PedidoValidation.showAdmin),
  pedidoController.showAdmin
);
router.delete(
  "/admin/:id",
  auth.required,
  LojaValidation.admin,
  validate(PedidoValidation.removeAdmin),
  pedidoController.removeAdmin
);

// -- Carrinho

router.get(
  "/admin/:id/carrinho",
  auth.required,
  LojaValidation.admin,
  validate(PedidoValidation.showCarrinhoPedidoAdmin),
  pedidoController.showCarrinhoPedidoAdmin
);
// - Entrega

//- Pagamento

//CLIENTES

router.get(
  "/",
  auth.required,
  validate(PedidoValidation.index),
  pedidoController.index
);
router.get(
  "/:id",
  auth.required,
  validate(PedidoValidation.show),
  pedidoController.show
);
router.post(
  "/",
  auth.required,
  validate(PedidoValidation.store),
  pedidoController.store
);
router.delete(
  "/:id",
  auth.required,
  validate(PedidoValidation.remove),
  pedidoController.remove
);

// -- Carrinho

router.get(
  "/:id/carrinho",
  auth.required,
  validate(PedidoValidation.showCarrinhoPedido),
  pedidoController.showCarrinhoPedido
);
// - Entrega

//- Pagamento

module.exports = router;
