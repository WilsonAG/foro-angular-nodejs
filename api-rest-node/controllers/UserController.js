'use strict';
const User = require('../models/User');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('../services/Jwt');
const fs = require('fs');
const path = require('path');

const controller = {
	save: (req, res) => {
		// recoger parametros de peticion
		let params = req.body;

		// validar datos
		try {
			var validate_name = !validator.isEmpty(params.name);
			var validate_lastname = !validator.isEmpty(params.lastname);
			var validate_email =
				!validator.isEmpty(params.email) &&
				validator.isEmail(params.email);
			var validate_password = !validator.isEmpty(params.password);
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
			var validate_email =
				!validator.isEmpty(params.email) &&
				validator.isEmail(params.email);
			var validate_password = !validator.isEmail(params.password);
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
			return res.status(401).send({
				message: 'Credenciales no validas, por favor intentalo denuevo.'
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
			status: 'ok',
			user: updatedUser
		});
	},

	uploadAvatar: async (req, res) => {
		// Configurar modulo multiparty

		// Recoger el archivo de la peticion
		if (!req.files) {
			return res.status(404).send({
				status: 'error',
				message: 'No se ha seleccionado ninguna imagen.'
			});
		}

		// obtener name y extencion
		let filePath = req.files.file0.path;
		let fileSplit = filePath.split('/');
		let fileName = fileSplit[2];
		let fileExt = fileName.split('.')[1];

		// Comprobar extension solo imagenes, si no es valido eliminar archivo
		if (
			fileExt != 'png' &&
			fileExt != 'jpg' &&
			fileExt != 'jpeg' &&
			fileExt != 'gif'
		) {
			fs.unlink(filePath, () => {
				return res.status(200).send({
					status: 'error',
					message: 'El formato del archivo no es valido'
				});
			});
		} else {
			// sacar id del usuario identificado
			let userID = req.user.sub;

			// Buscar y actualizar documento en bd
			let updatedUser = await User.findOneAndUpdate(
				{
					_id: userID
				},
				{ image: fileName },
				{ new: true }
			).exec();

			if (!updatedUser) {
				return res.status(400).send({
					status: 'error',
					message: 'Se produjo un error al subir la imagen.'
				});
			}

			return res.status(200).send({
				status: 'ok',
				message: 'avatar uploaded',
				user: updatedUser
			});
		}
	},

	avatar: (req, res) => {
		let fileName = req.params.fileName;
		let pathFile = './uploads/users/' + fileName;

		fs.exists(pathFile, existsFile => {
			if (existsFile) {
				return res.sendFile(path.resolve(pathFile));
			}

			return res.status(404).send({
				message: 'No se pudo encontrar el avatar.'
			});
		});
	},

	getUsers: async (req, res) => {
		const users = await User.find().exec();
		if (users) {
			return res.status(200).send({
				status: 'ok',
				users
			});
		}
		return res.status(404).send({
			status: 'error',
			message: 'no hay usuarios para mostrar'
		});
	},
	getUser: async (req, res) => {
		try {
			let userID = req.params.id;
			const user = await User.findById(userID).exec();

			if (user) {
				return res.status(200).send({
					status: 'ok',
					user
				});
			}

			return res.status(404).send({
				status: 'error',
				message: 'No se encontro el usuario.'
			});
		} catch (error) {
			return res.status(404).send({
				status: 'error',
				message: 'No se encontro el usuario.'
			});
		}
	}
};

module.exports = controller;
