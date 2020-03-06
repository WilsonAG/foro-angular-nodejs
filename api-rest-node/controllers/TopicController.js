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

		// Guardar el topic
		const storedTopic = await topic.save();
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

	// Devolver respuesta

	return res.status(200).send({
		message: 'Hola topic controller'
	});
};

module.exports = controller;
