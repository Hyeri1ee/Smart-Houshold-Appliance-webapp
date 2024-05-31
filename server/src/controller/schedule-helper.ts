import { Pool, QueryResult } from 'pg';

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hboict',
  password: '1234',
  port: 5432,
});
export const queryDatabase = async (query: string): Promise<QueryResult> => {
    try {
      const res = await pool.query(query);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    } 
  };
