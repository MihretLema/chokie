import {PrismaClient,type Prisma} from '@/generated/prisma/client';
import {PrismaPg} from '@prisma/adapter-pg';
import {getEnv} from '../env';
const globalDb=globalThis as unknown as {chokieDb?:PrismaClient};
export function getDb(){if(!globalDb.chokieDb){const adapter=new PrismaPg({connectionString:getEnv().DATABASE_URL,max:10,connectionTimeoutMillis:5000,idleTimeoutMillis:30000});globalDb.chokieDb=new PrismaClient({adapter,log:[]});}return globalDb.chokieDb;}
export type DbTransaction=Prisma.TransactionClient;
