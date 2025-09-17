const {Pool} = require('pg')

const cfg = require('../config/cfg.json');
const host = cfg.pg.host;
const port = cfg.pg.port;
const database = cfg.pg.database;
const user = cfg.pg.user;
const password = cfg.pg.password;

module.exports = class PSQLProvider {

    static async getInstance() {
        if (PSQLProvider.instance)
            return PSQLProvider.instance;

        let instance = new PSQLProvider;
        await instance.init();
        PSQLProvider.instance = instance;

        return PSQLProvider.instance;
    }

    async init() {

        this.pool = new Pool({
            host: host,
            port: port,
            database: database,
            user: user,
            password: password,
        });

        const initQuery = `
        CREATE TABLE IF NOT EXISTS users (
            username text PRIMARY KEY,
            password text NOT NULL
        );
        `;

        let connection = await this.connect()
        connection.query(initQuery);
        await connection.release();

        PSQLProvider.instance = this;
    }

    async connect() {
        return this.pool.connect();
    }

}