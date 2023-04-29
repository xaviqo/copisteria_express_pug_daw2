const express = require('express');
const connection = require('../mysql.js');
const router = express.Router();

router.get("/", async (req, res) => {
   try {
      const printers = [];
      for (let i = 1; i <= 3; i++) {
         printers.push({
            id: i,
            queue: await getPrinterQueue(i),
            ink: await getPrinterInk(i)
         });
      }
      console.log(printers);
      res.render("index", { printers: printers });
   } catch (error) {
      console.error(error);
      res.status(500).send("Error");
   }
});

async function getPrinterInk(printerId) {
   return new Promise((resolve, reject) => {
      connection.query(`SELECT cyan, yellow , magenta, black FROM printer WHERE id = ${printerId}`, (err, res) => {
         if (err) {
            console.error(err);
            reject(err);
         } else {
            const row = res[0]; // Obtener el primer objeto de la fila
            const contents = { // Crear el objeto deseado a partir de los valores de la fila
               c: row.cyan,
               y: row.yellow,
               m: row.magenta,
               k: row.black
            };
            resolve(contents);
         }
      });
   });
}

async function getPrinterQueue(printerId) {
   return new Promise((resolve, reject) => {
      connection.query(`SELECT content FROM queue WHERE printer = ${printerId}`, (err, res) => {
         if (err) {
            console.error(err);
            reject(err);
         } else {
            const contents = res.map(row => row.content);
            resolve(contents);
         }
      });
   });
}



module.exports = router;