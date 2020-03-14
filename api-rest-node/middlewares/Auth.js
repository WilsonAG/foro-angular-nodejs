'use strict';
const jwt = require('jwt-simple');
const moment = require('moment');
const jwtKey = process.env.JWT_KEY;

exports.auth = (req, res, next) => {
	//comprobar si llega autorizacion
	if (!req.headers.authorization) {
		return res.status(403).send({
			message: 'No esta autorizado para realizar esta accion.'
		});
	}
	// limpiar token
	let token = req.headers.authorization.replace(/['"]+/g, '');

	try {
		//decodificar token

		var payload = jwt.decode(token, jwtKey);
		if (payload.exp <= moment().unix()) {
			return res.status(400).send({
				message: 'El token ha expirado.'
			});
		}
	} catch (error) {
		return res.status(403).send({
			message: 'No esta autorizado para realizar esta accion.'
		});
	}

	//comprobar expiracion del token
	req.user = payload;

	//adjuntar user a la request

	// next

	next();
};
