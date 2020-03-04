'use strict';

require('dotenv').config();

const jwt = require('jwt-simple');
const moment = require('moment');
const key = process.env.JWT_KEY || 'GENERAR UNA CLAVE SECRETA AQUI';

exports.createToken = user => {
	let payload = {
		sub: user._id,
		name: user.name,
		lastname: user.lastname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(7, 'days').unix
	};
	console.log(key);

	return jwt.encode(payload, key);
};
