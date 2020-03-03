'use strict';

// requires
var express = require('express');
var bodyParser = require('body-parser');

// ejecutar express
const app = express();

// cargar archivos de rutas

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors

// reescribir rutas
// rutas , metodo de prueba
app.post('/prueba', (req, res) => {
	return res.status(200).send({
		message: 'hola mundo desde express'
	});
});

// export modulo
module.exports = app;
