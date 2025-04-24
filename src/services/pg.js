const {Pool} = require('pg');
const config = require("config");

class Postgres {
    constructor() {
        this.client = null;

        this.disableService();
    }

    enableService() {
        this.enabled = true;
    }

    disableService() {
        this.enabled = false;
    }

    isEnable() {
        return this.enabled;
    }

    async connect(flush=false) {
        try {
            const pgConfig = {
                host: process.env.POSTGRES_HOST || config.get("pg.host"),
                port: process.env.POSTGRES_PORT || config.get("pg.port"),
                user: process.env.POSTGRES_USER || config.get("pg.username"),
                password: process.env.POSTGRES_PASSWORD || config.get("pg.password"),
                database: process.env.POSTGRES_DB || config.get("pg.database"),
            };

            this.client = new Pool(pgConfig);

            this.enableService();

            return {success:true, message:'Postgres connected successfully'};
        } 
        catch (e) {
            return {success:false, message:'Postgres connected failed '};
        }
    }

    async execQuery(query) {
        try {
            const result = await this.client.query(query);
            
            return {success:true, data:result.rows, count:result.rowCount};
        } 
        catch (e) {
            return {success:false, message:e.message};
        }
    }
}

module.exports = { pg: new Postgres() };
