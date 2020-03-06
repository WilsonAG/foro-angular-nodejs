'use strict';
const validator = require('validator');
const Topic = require('../models/Topic');

const controller = {};

controller.save = async (req, res) => {
	// recoger parametros de la peticion
	let params = req.body;

	// Validar datos
	try {
		var v_title = !validator.isEmpty(params.title);
		var v_content = !validator.isEmpty(params.content);
		var v_lang = !validator.isEmpty(params.lang);
	} catch (error) {
		return res.status(200).send({
			status: 'error',
			message: 'Faltan datos por enviar.'
		});
	}

	if (v_title && v_content && v_lang) {
		// Crear objeto para guardar
		let topic = new Topic();

		// Asignar valores
		topic.title = params.title;
		topic.content = params.content;
		topic.code = params.code;
		topic.lang = params.lang;
		topic.user = req.user.sub;

		// Guardar el topic
		const storedTopic = await topic.save();
		// Devolver respuesta
		if (storedTopic) {
			return res.status(201).send({
				status: 'ok',
				topic: storedTopic
			});
		} else {
			return res.status(400).send({
				status: 'error',
				message: 'error al crear tema en el foro.'
			});
		}
	}
};

controller.getTopics = async (req, res) => {
	// cargar libreria de paginacion (en el modelo)
	// Recoger pagina actual
	let page = parseInt(req.params.page) || 1;

	//indicar opciones de paginacion
	let options = {
		sort: {
			date: -1
		},
		populate: 'user',
		limit: 5,
		page: page
	};
	// find paginado
	const topics = await Topic.paginate({}, options);

	// Devolver resultado (topics, total de topics, total de paginas)
	if (!topics) {
		return res.status(400).send({
			status: 'error',
			message: 'Error al obtener los temas.'
		});
	} else {
		return res.status(200).send({
			status: 'ok',
			topics: topics.docs,
			totalDocs: topics.totalDocs,
			totalPages: topics.totalPages
		});
	}
};

module.exports = controller;
