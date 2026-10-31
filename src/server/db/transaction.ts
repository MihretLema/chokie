import type {Prisma} from '@/generated/prisma/client';
import {getDb} from './client';
export async function transaction<T>(operation:(tx:Prisma.TransactionClient)=>Promise<T>){for(let attempt=0;;attempt++){try{return await getDb().$transaction(operation,{isolationLevel:'Serializable',maxWait:10000,timeout:15000})}catch(error){if((error as {code?:string}).code!=='P2034'||attempt>=2)throw error;}}}
