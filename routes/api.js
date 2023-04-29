const express = require('express');
const router = express.Router();
const connection = require('../mysql.js');
const util = require('util');

router.post("/queue/:printerId", (req, res) => {
    const id = req.params.printerId;
    const text = req.body.text;
    const sql = "INSERT INTO queue VALUES(?,?)";

    connection.query(sql, [id,text], (error, results, fields) => {
        if (error) {
            console.error(error)
            return;
        }
        res.redirect('/');
    });
});

router.post("/print/:printerId", async (req, res) => {
    const query = util.promisify(connection.query).bind(connection);
    const id = req.params.printerId;
    const totalWords = await query("SELECT content FROM queue WHERE printer = ? LIMIT 1", [id])
        .then(results => {
            console.log("total words: " + results[0].content.length)
            return results[0].content.length;
        })
        .catch(error => {
            console.error(error)
            return 0;
        });
    const inkPercent = await query("SELECT black FROM printer WHERE id = ?", [id])
        .then(results => {
            return results[0].black - (totalWords / 100).toFixed(2);
        })
        .catch(error => {
            console.error(error)
            return 0;
        });

    if (inkPercent > 0) {
        await query("DELETE FROM queue WHERE printer = ? LIMIT 1", [id]);
        await query(
            `UPDATE printer SET cyan = ${inkPercent}, yellow = ${inkPercent}, magenta = ${inkPercent}, black = ${inkPercent} WHERE id = ${id}`
        );
    }
    console.log(inkPercent)
    res.redirect('/');
});


module.exports = router;