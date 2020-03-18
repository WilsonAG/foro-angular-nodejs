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

controller.getTopicsByUser = async (req, res) => {
	// Conseguir id del usuario
	let userID = req.params.userID;

	// Find con una condicion de usuario
	const topics = await Topic.find({
		user: userID
	})
		.sort([['date', 'descending']])
		.populate('user')
		.exec()
		.catch(err => {
			return res.status(500).send({
				status: 'error',
				message: 'Error en la peticion, el id no es valido'
			});
		});

	if (!topics) {
		return res.status(404).send({
			status: 'error',
			message: 'No hay temas para mostrar'
		});
	} else {
		// Devolver resultado

		return res.status(200).send({
			status: 'ok',
			topics
		});
	}
};

controller.getTopic = async (req, res) => {
	// sacar id del topic de la url
	let topicID = req.params.id;

	// find topic por id
	const topic = await Topic.findById(topicID)
		.populate('user')
		.populate('comments.user')
		.exec()
		.catch(err => {
			return res.status(500).send({
				status: 'error',
				message: 'Peticion no valida, el id no es valido'
			});
		});

	// devolver resultado
	if (!topic) {
		return res.status(404).send({
			status: 'error',
			message: 'No existe el tema.'
		});
	} else {
		topic.comments = topic.comments.reverse();
		return res.status(200).send({
			status: 'ok',
			topic
		});
	}
};

controller.update = async (req, res) => {
	// recoger id de la url
	let topicID = req.params.id;

	// recoger datos de la peticion
	let params = req.body;

	// valdiar datos
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

	// crear json con satos a modificar
	if (!(v_title && v_content && v_lang)) {
		return res.status(400).send({
			message: 'Error al actualizar usuario, no se puede validar'
		});
	}
	let updateData = {
		title: params.title,
		content: params.content,
		code: params.code,
		lang: params.lang
	};

	// find and update del topic por id e id de user
	try {
		const updatedTopic = await Topic.findOneAndUpdate(
			{
				_id: topicID,
				user: req.user.sub
			},
			updateData,
			{ new: true }
		).exec();

		// devolver respuesta
		if (!updatedTopic) {
			return res.status(404).send({
				status: 'error',
				message: 'no se encuentra el tema'
			});
		} else {
			return res.status(200).send({
				status: 'ok',
				topic: updatedTopic
			});
		}
	} catch (error) {
		return res.status(500).send({
			status: 'error',
			message: 'Error al actualizar topic, el id no es valido'
		});
	}
};

controller.delete = async (req, res) => {
	// sacar id del topic de la url
	let topicID = req.params.id;

	try {
		// find and delete por topic id y por user id
		let removerdTopic = await Topic.findOneAndDelete({
			_id: topicID,
			user: req.user.sub
		}).exec();

		// devolver respuesta
		if (!removerdTopic) {
			return res.status(404).send({
				status: 'error',
				message: 'no se pudo encontrar topic para eliminar'
			});
		} else {
			return res.status(200).send({
				status: 'ok',
				topic: removerdTopic
			});
		}
	} catch (error) {
		return res.status(500).send({
			status: 'error',
			message: 'No se pudo eliminar topic, el id no es valido'
		});
	}
};

controller.search = async (req, res) => {
	// obtener string a buscar
	const term = req.params.term;

	// find or
	try {
		const topics = await Topic.find({
			$or: [
				{ title: { $regex: term, $options: 'i' } },
				{ content: { $regex: term, $options: 'i' } },
				{ code: { $regex: term, $options: 'i' } },
				{ lang: { $regex: term, $options: 'i' } }
			]
		})
			.sort([['date', 'descending']])
			.populate('user')
			.exec();

		//devolver resultado
		if (!topics) {
			return res.status(404).send({
				status: 'error',
				message: 'No se encontro ningun tema relacionado'
			});
		} else {
			return res.status(200).send({
				status: 'ok',
				topics
			});
		}
	} catch (error) {
		return res.status(500).send({
			status: 'error',
			message: 'error en la peticion'
		});
	}
};
module.exports = controller;
