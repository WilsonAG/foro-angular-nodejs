var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3000;

mongoose.Promise = global.Promise;
mongoose
	.connect('mongodb://localhost:27017/forum', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('La conexion se ha realizado con exito');
		// creo server

		app.listen(port, () => {
			console.log('server is running at: http://localhost:' + port);
		});
	})
	.catch(() => console.log('error'));
