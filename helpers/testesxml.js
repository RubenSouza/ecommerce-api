// let varXml = "<root>Hello x2js!</root>";

let varXml =
  '<?xml version="1.0" encoding="utf-8"?>' +
  '<note importance="high" logged="true">' +
  "    <title>Happy</title>" +
  "    <todo>Work</todo>" +
  "    <todo>Play</todo>" +
  "</note>";

const X2JS = require("x2js");

const x2js = new X2JS();

const result = x2js.xml2js(varXml);

// const document = JSON.stringify(result);

// const json = JSON.parse(document);

console.log("resultado que vem da Library sem tratamento", result);
// console.log("Transformando em String com o stringfy", document);
// console.log("Transformando objeto com o PARSER", json);

// var convert = require('xml-js');
// var xml = require('fs').readFileSync('./testscenario.xml', 'utf8');

// var result = convert.xml2json(xml, {compact: true, spaces: 4});
// console.log(result);
