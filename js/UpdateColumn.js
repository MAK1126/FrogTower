'use strict';
const CDatabase = require('../CDatabase.js');
const CRYPTO = require('crypto');
const COMMON = require('./common');
export default class UpdateColumn {
    constructor() {
        console.log("UpdateColumn constructor");
        this.database = new CDatabase;
    }

    async update_column(req) {
        const connection = await this.database.GetConnection();
        let result = {};
        try {
            await connection.beginTransaction();
            await connection.query(" UPDATE LOG_GAMEDATA_TB SET " + column + " = " + value + " WHERE LOG_GAMEDATA_PK = " + pk);
            await connection.commit();
        } catch (error) {
            console.log(error);
            if (connection) {
                await connection.rollback();
                await connection.release();
            }
            result.result_code = 'r9999'; 
            return result;
        } finally {
            if (connection) {
                await connection.release();
            }
        }
    }

}
