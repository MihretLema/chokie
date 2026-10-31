import {randomBytes} from 'node:crypto';
import {mkdirSync,existsSync,writeFileSync,readFileSync,unlinkSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';
import pg from 'pg';
import {parse} from 'dotenv';
// Dedicated loopback cluster. Never connects to a pre-existing server or database.
const root=resolve('.local/postgres'),bin=process.env.POSTGRES_BIN||'C:/Program Files/PostgreSQL/18/bin';
const envPath=resolve('.env');
if(existsSync(envPath)&&!existsSync(join(root,'PG_VERSION')))throw new Error('Existing .env detected. Configure PostgreSQL manually; no existing configuration will be overwritten.');
mkdirSync(root,{recursive:true});
let env=existsSync(envPath)?parse(readFileSync(envPath)):null;
if(!env){const owner=randomBytes(32).toString('base64url'),app=randomBytes(32).toString('base64url');env={DATABASE_URL:`postgresql://chokie_app:${app}@127.0.0.1:55432/chokie`,MIGRATION_DATABASE_URL:`postgresql://chokie_owner:${owner}@127.0.0.1:55432/chokie`,TEST_DATABASE_URL:`postgresql://chokie_owner:${owner}@127.0.0.1:55432/chokie_test`,AUTH_SECRET:randomBytes(48).toString('base64url'),OUTBOX_ENCRYPTION_KEY:randomBytes(32).toString('hex'),AUTH_URL:'http://127.0.0.1:3001',APP_URL:'http://127.0.0.1:3001',NEXT_PUBLIC_SITE_URL:'http://127.0.0.1:3001',EMAIL_PROVIDER:'disabled',POSTGRES_USER:'chokie_owner',POSTGRES_PASSWORD:owner,POSTGRES_DB:'chokie',POSTGRES_PORT:'55432',SMTP_PORT:'1025',SMTP_SECURE:'false',S3_REGION:'us-east-1',S3_FORCE_PATH_STYLE:'true',TRUST_PROXY:'false'};writeFileSync(envPath,Object.entries(env).map(([k,v])=>`${k}=${v}`).join('\n')+'\n',{mode:0o600});}
const ownerUrl=new URL(env.MIGRATION_DATABASE_URL);if(ownerUrl.hostname!=='127.0.0.1'||ownerUrl.port!=='55432'||ownerUrl.pathname!=='/chokie')throw new Error('This helper only operates on its dedicated loopback cluster.');
function run(exe,args,allowed=[0]){const r=spawnSync(join(bin,exe+(process.platform==='win32'?'.exe':'')),args,{stdio:'ignore',windowsHide:true});if(!allowed.includes(r.status??-1))throw new Error(`${exe} failed. Check .local/postgres-server.log; no credentials are printed.`);return r.status;}
if(!existsSync(join(root,'PG_VERSION'))){const pw=resolve('.local/init-password');writeFileSync(pw,decodeURIComponent(ownerUrl.password),{mode:0o600});try{run('initdb',['-D',root,'-U','chokie_owner','--encoding=UTF8','--locale=C','--auth=scram-sha-256','--pwfile='+pw]);}finally{unlinkSync(pw)}}
if(run('pg_ctl',['status','-D',root],[0,3])===3)run('pg_ctl',['start','-D',root,'-l',resolve('.local/postgres-server.log'),'-o','-h 127.0.0.1 -p 55432','-w']);
const adminUrl=new URL(env.MIGRATION_DATABASE_URL);adminUrl.pathname='/postgres';const client=new pg.Client({connectionString:adminUrl.toString()});await client.connect();
try{const appUrl=new URL(env.DATABASE_URL);const role=await client.query('SELECT 1 FROM pg_roles WHERE rolname=$1',['chokie_app']);if(!role.rowCount){const formatted=await client.query('SELECT format(\'CREATE ROLE %I LOGIN PASSWORD %L\', $1::text, $2::text) AS sql',['chokie_app',decodeURIComponent(appUrl.password)]);await client.query(formatted.rows[0].sql);}for(const name of ['chokie','chokie_test']){if(!(await client.query('SELECT 1 FROM pg_database WHERE datname=$1',[name])).rowCount)await client.query('CREATE DATABASE '+name+' OWNER chokie_owner');}}finally{await client.end()}
console.log('Dedicated PostgreSQL is ready on loopback port 55432. Local secrets are in ignored .env. Application and isolated test databases are separate.');
