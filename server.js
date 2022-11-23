const express = require("express");

const { sequelize } = require("./db/models");
const routes = require("./api").routes;
const { port } = require("./config");

(async () => {
    await sequelize.sync();
    const app = express();
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    routes.attach(app);
    app.listen(port, () => {
        console.log(`Server is running at ${port}`);
    })
})();