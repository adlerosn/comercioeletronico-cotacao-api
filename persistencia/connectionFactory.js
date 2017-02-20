var mysql  = require('mysql');

function createDBConnection(){
		return mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'comercioeletronico'
		});
}

module.exports = function() {
	return createDBConnection;
}
