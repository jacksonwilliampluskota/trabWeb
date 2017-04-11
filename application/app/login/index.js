var express = require('express');
var rotas = express.Router();
/*arquivo com as funcoes da rota*/
var controller = require('./controller');

rotas.post('/', controller.auth);
/*Export*/
module.exports = rotas