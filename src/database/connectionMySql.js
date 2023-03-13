// const mariadb = require('mariadb');
import {config} from 'dotenv';
config();
import mariadb from 'mariadb';
const dbSettings = {
  connectionLimit : process.env.MYSQL_CONNECTION_LIMIT,
  host            : process.env.MYSQL_HOST,
  user            : process.env.MYSQL_USER,
  password        : process.env.MYSQL_PASSWORD,
  database        : process.env.MYSQL_DATABASE,
  connectTimeout: process.env.MYSQL_CONNECTION_TIMEOUT
};

const pool = mariadb.createPool(dbSettings);
export  {pool};