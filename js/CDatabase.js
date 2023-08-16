'use strict';
// const MYSQL = require('./node_modules/mysql2/promise.js');
import MYSQL from "./mysql";

export default class CDatabase {
    constructor() {
        console.log("CDatabase constructor");
    }
    async GetConnection() {
        if (!this.connectionPool) {
            this.connectionPool = await MYSQL.createPool({
                host: "localhost",
                user: "altongp2p",
                password: "altong2454$#",
                database: "altongp2p",
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
        }
        console.log("database");

        this.connection = await this.connectionPool.getConnection();
        return this.connection;
    }
}

module.exports = CDatabase;