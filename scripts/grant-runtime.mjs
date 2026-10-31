import 'dotenv/config';
import pg from 'pg';
const owner=process.env.MIGRATION_DATABASE_URL,app=process.env.DATABASE_URL;
if(!owner||!app)throw new Error('Both migration and runtime database URLs are required.');
const user=decodeURIComponent(new URL(app).username);if(!/^[a-z_][a-z0-9_]{0,62}$/.test(user)||user===decodeURIComponent(new URL(owner).username))throw new Error('Use a separate restricted runtime database role.');
const client=new pg.Client({connectionString:owner});await client.connect();try{await client.query('REVOKE CREATE ON SCHEMA public FROM PUBLIC');await client.query('GRANT USAGE ON SCHEMA public TO "'+user+'"');await client.query('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "'+user+'"');await client.query('REVOKE UPDATE, DELETE, TRUNCATE ON "AuditLog" FROM "'+user+'"');await client.query('REVOKE ALL ON "_prisma_migrations" FROM "'+user+'"');console.log('Runtime role permissions applied. DDL and audit modification remain restricted.')}finally{await client.end()}
