require("dotenv").config();
module.exports = {
  mode: process.env.NODE_ENV === "production" ? "live" : "sandbox",
  sandbox: process.env.NODE_ENV === "production" ? false : true,
  sandbox_email:
    process.env.NODE_ENV === "production"
      ? null
      : "c70642424335731695268@sandbox.pagseguro.com.br",
  email: process.env.email,
  token: process.env.token,
  notificationURL:
    "https://api.loja-teste.ampliee.com/v1/api/pagamentos/notificacao",
};
