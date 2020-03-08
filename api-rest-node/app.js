'use strict';

// requires
var express = require('express');
var bodyParser = require('body-parser');

// ejecutar express
const app = express();

// cargar archivos de rutas
const user_routes = require('./routes/user');
const topic_routes = require('./routes/topic');
const comment_routes = require('./routes/comments');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors
// Configurar cabeceras y cors
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
	);
	res.header(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, DELETE'
	);
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

// reescribir rutas
// rutas , metodo de prueba
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);

// export modulo
module.exports = app;
