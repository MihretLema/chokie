import {getDb} from '../db/client';
import {privateKey} from './crypto';
import {getEnv} from '../env';
import {ApiError} from './errors';
export function requestIdentity(request:Request){return getEnv().TRUST_PROXY==='true'?(request.headers.get('x-forwarded-for')?.split(',')[0].trim().slice(0,100)||'unknown'):'direct';}
export async function limit(key:string,max=8,seconds=900){const hash=privateKey(key);const expiresAt=new Date(Date.now()+seconds*1000);const rows=await getDb().$queryRaw<{count:number}[]>`INSERT INTO "RateLimit" ("key","count","expiresAt") VALUES (${hash},1,${expiresAt}) ON CONFLICT ("key") DO UPDATE SET "count"=CASE WHEN "RateLimit"."expiresAt" < NOW() THEN 1 ELSE "RateLimit"."count"+1 END,"expiresAt"=CASE WHEN "RateLimit"."expiresAt" < NOW() THEN EXCLUDED."expiresAt" ELSE "RateLimit"."expiresAt" END RETURNING "count"`;if(rows[0].count>max)throw new ApiError(429,'RATE_LIMITED','Too many requests. Please try again later.');}
