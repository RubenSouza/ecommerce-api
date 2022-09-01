const compression = require("compression");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const { ValidationError } = require("express-validation");
//start

const app = express();

// Ambiente

const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

//Arquivos estáticos

app.use("/public", express.static(__dirname + "/public"));
app.use("/public/images", express.static(__dirname + "/public/images"));

//Mongo DB

const dbs = require("./config/database");
const dbURI = isProduction ? dbs.dbProduction : dbs.dbTest;
mongoose.connect(dbURI, { useNewUrlParser: true });

//Setup EJS

app.set("view engine", "ejs");

//configurações

if (!isProduction) app.use(morgan("dev"));
app.use(cors());
app.disable("x-powered-by");
app.use(compression());

//BodyParser

app.use(bodyParser.urlencoded({ extended: false, limit: 1.5 * 1024 * 1024 }));
app.use(bodyParser.json({ limit: 1.5 * 1024 * 1024 }));

//Models

require("./models");

// Rotas

app.use("/", require("./routes"));

// Erro do express validate

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }
  return res.status(500).json(err);
});

//404 - error

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//422, 500, 401 ... erros status codes

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  if (error.status !== 404) {
    console.warn("Error: ", error.message, new Date());
    res.json({ errors: error.message, status: error.status });
  }
});

//Listen

app.listen(PORT, error => {
  if (error) throw error;
  console.log(`Rodando na //localhost:${PORT}`);
});
