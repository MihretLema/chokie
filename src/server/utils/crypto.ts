import {createCipheriv,createDecipheriv,randomBytes,createHash,createHmac} from 'node:crypto';
import {getEnv} from '../env';
export const tokenHash=(token:string)=>createHash('sha256').update(token).digest('hex');
export const opaqueToken=()=>randomBytes(32).toString('base64url');
export const reference=(prefix:string)=>prefix+'-'+randomBytes(12).toString('hex').toUpperCase();
export const privateKey=(value:string)=>createHmac('sha256',getEnv().AUTH_SECRET).update(value).digest('hex');
export function encrypt(value:unknown){const iv=randomBytes(12);const cipher=createCipheriv('aes-256-gcm',Buffer.from(getEnv().OUTBOX_ENCRYPTION_KEY,'hex'),iv);const encrypted=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return ['v1',iv.toString('hex'),cipher.getAuthTag().toString('hex'),encrypted.toString('base64')].join('.');}
export function decrypt<T>(value:string):T{const[version,iv,tag,data]=value.split('.');if(version!=='v1')throw new Error('Invalid encrypted payload');const cipher=createDecipheriv('aes-256-gcm',Buffer.from(getEnv().OUTBOX_ENCRYPTION_KEY,'hex'),Buffer.from(iv,'hex'));cipher.setAuthTag(Buffer.from(tag,'hex'));return JSON.parse(Buffer.concat([cipher.update(Buffer.from(data,'base64')),cipher.final()]).toString('utf8')) as T;}
