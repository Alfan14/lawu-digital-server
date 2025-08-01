import dotenv from 'dotenv';
import pg from 'pg';

const Pool = pg.Pool

dotenv.config(); 

const POSTGRES_URL = process.env.POSTGRES_URL ;

const pool = new Pool({
  
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

export default pool;