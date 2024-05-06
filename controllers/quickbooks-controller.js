const { QuickbooksAPI } = require("../api/quickbooks-api");

const qb = new QuickbooksAPI();

/**
 * 
 * @param {import('express').Response} res 
 * @param {any} err 
 */
function sendError(res, err) {
    res.setHeader("content-type", "text/plain");
    res.send(err.stack);
}

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
 * @returns {Promise}
 */
function getToken(req, res) {
    return qb.createToken(req.url)
        .catch((err) => {
            sendError(res, err);
        });
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @returns {Promise}
 */
function getEntity (req, res) {
    const {entity, id} = req.params;
    return qb.getEntity(entity, id)
        .then((data) => {
            res.json(data.body);
        })
        .catch((err) => {
            sendError(res, err);
        });
}

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @returns {Promise}
 */
function getQuery (req, res) {
    const {sql, minorversion} = sqlSelect(req);
    console.log(sql);
    return qb.query(encodeURI(sql), minorversion)
        .then((data) => {
            res.json(data.body["QueryResponse"]);
        })
        .catch((err) => {
            sendError(res, err);
        });
}

/**
 * 
 * @param {import('express').Request} req 
 * @returns {{sql: string, minorversion: string}}
 */
function sqlSelect(req) {
    var sql = `SELECT `;
    var minorversion;
    var sqlstm = {
        table: "",
        fields: [],
        where: [],
        order: []
    }
    
    Object.keys(req.query).forEach((key) => {
        switch (key.toLocaleLowerCase()) {
            case "table":
                sqlstm.table = req.query[key]
                break
            case "minorversion":
                minorversion = req.query[key];
                break
            case "where":
                sqlstm.where.push(req.query[key])
                break
            case "field":
                sqlstm.fields.push(req.query[key])
                break
            case "order":
                sqlstm.order.push(req.query[key])
                break
            case "start":
                sqlstm.start = req.query[key]
                break
            case "max":
                sqlstm.max = req.query[key]
                break
        }
    });
    sql += `${sqlstm.fields.length > 0 ? sqlstm.fields.join(", ") : "*"} `
    sql += `FROM ${sqlstm.table}`
    if (sqlstm.where.length > 0) {
        sql += ` WHERE ` + sqlstm.where.join(" AND ");
    }
    if (sqlstm.order.length > 0) {
        sql += ` ORDERBY ` + sqlstm.order.join(", ");
    }
    sql += `${sqlstm.start ? " STARTPOSITION " + sqlstm.start : ""}`
    sql += `${sqlstm.max ? " MAXRESULTS " + sqlstm.max : ""}`

    return {
        sql,
        minorversion
    };
}

module.exports = {
    getAuth,
    getToken,
    getEntity,
    getQuery
}