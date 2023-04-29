const mysql = require("mysql");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'copisteria_express'
});

connection.connect((error) => {
    if (error) {
        console.error('Error al conectar con MySQL: ' + error.stack);
        return;
    }
    console.log('Conexión establecida con MySQL');
});

module.exports = connection;