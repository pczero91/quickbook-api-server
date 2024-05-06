const express = require("express");
const { getAuth, getToken, getEntity, getQuery } = require("../controllers/quickbooks-controller");
const router = express.Router();

router.get("/oauth", (req, res) => {
    getAuth(req, res);
});

router.get("/callback", (req, res) => {
    getToken(req, res)
        .then(() => {
            res.send("Authorization succeded");
        });
});

router.get("/data/:entity/:id", (req, res) => {
    getEntity(req, res);
});

router.get("/query?", (req, res) => {
    getQuery(req, res);
});

module.exports = {
    router
}