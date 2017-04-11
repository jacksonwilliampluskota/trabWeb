var express = require('express');
var rotas = express.Router();
/*arquivo com as funcoes da rota*/
var controller = require('./controller');

rotas.get('/', controller.bestPointer);
rotas.post('/', controller.pointer);
/*Export*/
module.exports = rotas