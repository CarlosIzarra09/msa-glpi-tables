import {config} from 'dotenv';
config();
//console.info(process.env.PORT);
export default{
    port :process.env.PORT || 3000,
    /*connectionSql : {
        user : `${process.env.GLPIDB_USER}`,
        password : `${process.env.GLPIDB_PASSWORD}`,
        server : `${process.env.GLPIDB_SERVER}`,
        database :  `${process.env.GLPIDB_DATABASE}`,
    }*/
}