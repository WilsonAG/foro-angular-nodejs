'use strict';
const User = require('../models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('../services/Jwt');

const controller = {
	save: (req, res) => {
		// recoger parametros de peticion
		let params = req.body;

		// validar datos
		try {
			let validate_name = !validator.isEmpty(params.name);
			let validate_lastname = !validator.isEmpty(params.lastname);
			let validate_email =
				!validator.isEmpty(params.email) &&
				validator.isEmail(params.email);
			let validate_password = !validator.isEmpty(params.password);
		} catch (error) {
			return res.status(400).send({
				message: 'Faltan datos'
			});
		}

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
	},

	login: async (req, res) => {
		// recoger parametros
		let params = req.body;

		// validar datos
		try {
			let validate_email =
				!validator.isEmpty(params.email) &&
				validator.isEmail(params.email);
			let validate_password = !validator.isEmail(params.password);
		} catch (error) {
			return res.status(400).send({
				message: 'Faltan datos'
			});
		}

		if (!validate_email || !validate_password) {
			return res.status(401).send({
				message: 'Credenciales no validas, por favor intentalo denuevo.'
			});
		}
		// buscar usuarios en la bd
		const user = await User.findOne({
			email: params.email.toLowerCase()
		});

		if (!user) {
			return res.status(404).send({
				message: 'No se encuentra registrado.'
			});
		}
		//si lo encuentra, comprobar password
		const isCorrect = await bcrypt.compare(params.password, user.password);
		if (!isCorrect) {
			return res.status(401).send({
				message: 'Credenciales no validas, por favor intentalo denuevo.'
			});
		}
		//limpiar obj user
		user.password = undefined;

		// Generar token jwt
		if (params.token) {
			return res.status(200).send({
				status: 'ok',
				token: jwt.createToken(user)
			});
		}

		// si coinciden devolver datos
		return res.status(200).send({
			status: 'ok',
			user
		});
	},

	update: async (req, res) => {
		// recoger datos de la peticion
		let params = req.body;

		// Validar datos
		try {
			let validate_name = !validator.isEmpty(params.name);
			let validate_lastname = !validator.isEmpty(params.lastname);
			let validate_email =
				!validator.isEmpty(params.email) &&
				validator.isEmail(params.email);
		} catch (error) {
			return res.status(400).send({
				message: 'Faltan datos'
			});
		}

		// eliminar propiedades innecesrias
		delete params.password;

		// comprobar email unico
		if (req.user.email != params.email) {
			const user2 = await User.findOne({
				email: params.email.toLowerCase()
			});

			if (user2 && user2.email == params.email) {
				return res.status(400).send({
					message: 'No puede usar esta direccion de email.'
				});
			}
		}
		// buscar y actualizar documento
		let userId = req.user.sub;

		const updatedUser = await User.findOneAndUpdate(
			{ _id: userId },
			params,
			{ new: true }
		);

		if (!updatedUser) {
			return res.status(500).send({
				message: 'Error al actualizar datos del usuario'
			});
		}
		// devolver respuesta
		updatedUser.password = undefined;
		return res.status(200).send({
			message: 'metodo de actualizacion',
			user: updatedUser
		});
	}
};

module.exports = controller;
