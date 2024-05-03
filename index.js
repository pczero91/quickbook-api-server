const express = require("express");
const { router } = require("./routes/quickbooks-routes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.text());

app.use(express.static("public"));
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
});