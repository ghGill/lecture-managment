const { Sequelize } = require('sequelize');
const config = require("config");

let seqClient = null;

try {
    const dbName = process.env.POSTGRES_DB || config.get("pg.database");
    const userName = process.env.POSTGRES_USER || config.get("pg.username");
    const password = process.env.POSTGRES_PASSWORD || config.get("pg.password");

    seqClient = new Sequelize(dbName, userName, password, {
        host: process.env.POSTGRES_HOST || config.get("pg.host"),
        port: process.env.POSTGRES_PORT || config.get("pg.port"),
        dialect: 'postgres',
        logging: false, // optional, disable logging
    });
} 
catch (e) {
    console.error(e.message);
}

module.exports = seqClient;
