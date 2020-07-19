import { Client } from 'pg';

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DATABASE,
});
client.connect();

const getNodes = async (appId: string) => {
  const { rows } = await client.query(`
    SELECT nodes 
    FROM apps
    WHERE appId = '${appId}'
  `);
  return rows[0];
};

const removeStrandedNodes = () => {};