const express = require('express');
const logger = require('morgan');
const path = require('path');
const app = express();
const fs = require('fs');
const connection = require('./mysql.js');
app.use(logger('dev'));

fs.readFile('script.sql', 'utf8', (err, data) => {
  if (err) throw err;

  const queries = data.split(';').filter(Boolean);

  connection.query('SET FOREIGN_KEY_CHECKS=0;', (error) => {
    if (error) throw error;

    queries.forEach((query) => {
      connection.query(`${query};`, (error, results, fields) => {
        if (error) throw error;
        console.log('Consulta ejecutada con éxito');
      });
    });

    connection.query('SET FOREIGN_KEY_CHECKS=1;', (error) => {
      if (error) throw error;
      console.log('Todas las consultas se ejecutaron con éxito');
    });
  });
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", require("./routes/routes.js"));
app.use("/api/", require("./routes/api.js"));

// Configuración de Express
app.set('view engine', 'pug');
app.set('views', './views');

app.listen(3000, () => {
  console.log('Aplicación corriendo en el puerto 3000');
});

module.exports = {
  connection: connection
};