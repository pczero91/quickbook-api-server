const { QuickbooksAPI } = require("../api/quickbooks-api");

const qb = new QuickbooksAPI();

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
function getAuth(req, res) {
    res.redirect(qb.getAuthURI());
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
function getToken(req, res) {
    qb.createToken(req.url)
        .then((authResponse) => {
            res.redirect("/main.html");
        }).catch((err) => {
            res.setHeader("content-type", "text/plain");
            res.send(err.stack);
        });
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
function getEntity (req, res) {
    const {entity, id} = req.params;
    qb.getEntity(entity, id)
        .then((authResponse) => {
            res.json(authResponse.json);
        }).catch((err) => {
            res.setHeader("content-type", "text/plain");
            res.send(err.stack);
        });
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
function getQuery (req, res) {
    var sql = `SELECT * FROM `;
    var minorversion;
    var conditions = [];
    Object.keys(req.query).forEach((key) => {
        if (key.toLocaleLowerCase() == "table") {
            sql += `${req.query[key]}`;
            return;
        }
        if (key.toLocaleLowerCase() == "minorversion") {
            minorversion = req.query[key];
            return;
        }
        conditions.push(`${key}=${req.query[key]}`);
    });
    if (conditions.length > 0) {
        sql += ` WHERE ` + conditions.join(", ");
    }
    qb.query(encodeURI(sql, minorversion))
        .then((authResponse) => {
            res.json(authResponse.json["QueryResponse"]);
        }).catch((err) => {
            res.setHeader("content-type", "text/plain");
            res.send(err.stack);
        });
}

module.exports = {
    getAuth,
    getToken,
    getEntity,
    getQuery
}