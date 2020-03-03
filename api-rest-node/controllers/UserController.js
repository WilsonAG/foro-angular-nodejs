'use strict';
const validator = require('validator');
let User = require('../models/User');
const bcrypt = require('bcrypt');

const controller = {
	save: (req, res) => {
		// recoger parametros de peticion
		let params = req.body;

		// validar datos
		let validate_name = !validator.isEmpty(params.name);
		let validate_lastname = !validator.isEmpty(params.lastname);
		let validate_email =
			!validator.isEmpty(params.email) && validator.isEmail(params.email);
		let validate_password = !validator.isEmpty(params.password);

		if (
			!(
				validate_name &&
				validate_lastname &&
				validate_email &&
				validate_password
			)
		) {
			return res.status(400).send({
				message: 'La validacion de los datos no son correctos.'
			});
		}

		// crear objeto usuario
		let user = new User();

		// Asignar valores al objeto usuario
		user.name = params.name;
		user.lastname = params.lastname;
		user.email = params.email.toLowerCase();
		user.role = 'ROLE_USER';
		user.image = null;

		// comprobar si usuario existe
		User.findOne({ email: user.email }, (error, isset) => {
			if (error) {
				return res.status(500).send({
					message: 'Error al comprobar duplicado de usuario.'
				});
			}

			if (isset) {
				return res.status(400).send({
					message: 'El usuario ya se encuentra registrado.'
				});
			}

			// si no existe cifrar password
			bcrypt.hash(params.password, 1, (err, hash) => {
				user.password = hash;

				// guardar en la bd
				user.save((err, userStored) => {
					if (err) {
						return res.status(500).send({
							message: 'Error al guardar el usuario.'
						});
					}

					if (!userStored) {
						return res.status(500).send({
							message: 'El usuario no se ha guardado.'
						});
					}

					// devolver respuesta

					return res.status(200).send({
						message: 'Registro completado con exito',
						user: userStored
					});
				});
			});
		});
	}
};

module.exports = controller;
