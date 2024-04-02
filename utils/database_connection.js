import { connect } from 'mongoose';
import { database_connection_string } from '../config.js';

export default new Promise(async (resolve, reject) => {
    try{
        await connect(database_connection_string).then(() => console.log('connected to database'))
        return resolve(true) 
    }catch(e){
        return reject (new Error('Connection Error: ' + e.message))
    }
})