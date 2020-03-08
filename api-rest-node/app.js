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

// reescribir rutas
// rutas , metodo de prueba
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);

// export modulo
module.exports = app;
