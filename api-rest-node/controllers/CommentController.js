'use strict';

const controller = {};
const Topic = require('../models/Topic');
const validator = require('validator');

controller.add = async (req, res) => {
	// recoger id del topic del url
	let topicID = req.params.id;

	try {
		// find por id del topic
		var topic = await Topic.findById(topicID).exec();
		if (!topic) {
			return res.status(404).send({
				status: 'error',
				message: 'No se encuentra topic'
			});
		}
	} catch (error) {
		return res.status(500).send({
			status: 'error',
			message: 'error en la peticion, el id no es valido'
		});
	}

	// comprobar objeto usuario y validar datos

	// validar datos
	try {
		var v_content = !validator.isEmpty(req.body.content);
	} catch (error) {
		return res.status(500).send({
			status: 'error',
			message: 'No has comentado nada.'
		});
	}

	if (!v_content) {
		return res.status(500).send({
			status: 'error',
			message: 'Error en la validacion'
		});
	}

	// En la propiedad comments hacer push
	let comment = {
		user: req.user.sub,
		content: req.body.content
	};

	topic.comments.push(comment);

	// Guardar el topic completo
	const newTopic = await topic.save();

	if (!newTopic) {
		return res.status(500).send({
			status: 'error',
			message: 'error al guardar el comentario'
		});
	} else {
		const topic = await Topic.findById(newTopic._id)
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
	}
};

controller.update = async (req, res) => {
	// Conseguir id del comentario
	let commentID = req.params.id;

	// recoger datos y validar
	const params = req.body;
	try {
		var v_content = !validator.isEmpty(params.content);
	} catch (error) {
		return res.status(400).send({
			message: 'No se ha comentado en el topic.'
		});
	}

	try {
		// find and update de un subdocumento
		var newTopic = await Topic.findOneAndUpdate(
			{ 'comments._id': commentID },
			{
				$set: {
					'comments.$.content': params.content
				}
			},
			{ new: true }
		).exec();
	} catch (error) {
		return res.status(500).send({
			status: 'error',
			message: 'error en la peticion, id no valido'
		});
	}

	// devolver respuesta
	if (!newTopic) {
		return res.status(404).send({
			status: 'error',
			message: 'No existe el tema'
		});
	} else {
		return res.status(200).send({
			status: 'ok',
			topic: newTopic
		});
	}
};

controller.delete = async (req, res) => {
	// sacar id del topic y del comentario a borrar
	const topicID = req.params.topicID;
	const commentID = req.params.commentID;

	// buscar el topic
	try {
		const topic = await Topic.findById(topicID).exec();
		if (!topic) {
			return res.status(404).send({
				status: 'error',
				message: 'No se pudo encontrar el tema'
			});
		}

		// seleccionar el subdoc (commentario)
		const comment = topic.comments.id(commentID);
		if (!comment) {
			return res.status(404).send({
				status: 'error',
				message: 'No se pudo encontrar el comentario'
			});
		} else {
			// borrar el comentario
			comment.remove();

			// guardar el topic
			const newTopic = await topic.save();

			// devolver resultado

			if (!newTopic) {
				return res.status(500).send({
					status: 'error',
					message: 'error al guardar el comentario'
				});
			} else {
				const topic = await Topic.findById(newTopic._id)
					.populate('user')
					.populate('comments.user')
					.exec();

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
			}
		}
	} catch (error) {
		return res.status(500).send({
			status: 'error',
			message: 'id no es valido'
		});
	}
};

module.exports = controller;
