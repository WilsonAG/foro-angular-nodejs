const mongoose = require('mongoose');
const app = require('./app');
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose
	.connect('mongodb://localhost:27017/forum', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => {
		console.log('La conexion se ha realizado con exito');
		// creo server

		app.listen(port, () => {
			console.log('server is running at: http://localhost:' + port);
		});
	})
	.catch(() => console.log('error'));
