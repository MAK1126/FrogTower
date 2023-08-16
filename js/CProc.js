'use strict';
const CDatabase = require('./CDatabase.js');
const CRYPTO = require('crypto');
const COMMON = require('./common');
export default class CProc {
    constructor() {
        console.log("CProc constructor");
        this.database = new CDatabase;
    }

    async connect_data_load(req) {
        console.log("connection");

        const connection = await this.database.GetConnection();
        let result = {};
        let a_data = [];
        result.tr_code = '6896';
        try {
            await connection.query(" SELECT * FROM LOG_GAMEDATA_TB ORDER BY GAMEDATA_POINT DESC LIMIT 5 ");
            
            console.log("query select");

            result.a_data = a_data;
            return result;

        } catch (error) {
            console.log("Error executing query:", error);

            if (connection) {
                await connection.rollback();
                await connection.release();
            }
            result.result_code = 'r9999'; 
            return result;
            
        } finally {
            if (connection) {
                console.log("finally connection");

                await connection.release();
            }
        }
    }

}