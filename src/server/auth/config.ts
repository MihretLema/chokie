import 'server-only';
import {betterAuth} from 'better-auth/minimal';
import {prismaAdapter} from '@better-auth/prisma-adapter';
import {getDb} from '../db/client';
import {getEnv} from '../env';
import {hashPassword,verifyPassword} from './password';
function createAuth(){const env=getEnv();return betterAuth({appName:'CHOKIE IT SOLUTIONS',baseURL:env.AUTH_URL,basePath:'/api/auth',secret:env.AUTH_SECRET,database:prismaAdapter(getDb(),{provider:'postgresql',transaction:true}),trustedOrigins:[new URL(env.APP_URL).origin],emailAndPassword:{enabled:true,disableSignUp:true,minPasswordLength:12,maxPasswordLength:128,password:{hash:hashPassword,verify:({hash,password})=>verifyPassword(hash,password)}},session:{expiresIn:28800,updateAge:900,cookieCache:{enabled:false}},verification:{modelName:'verificationToken'},account:{accountLinking:{enabled:false}},advanced:{database:{generateId:'uuid'},useSecureCookies:env.APP_URL.startsWith('https://'),defaultCookieAttributes:{httpOnly:true,sameSite:'strict'},ipAddress:{ipAddressHeaders:env.TRUST_PROXY==='true'?['x-forwarded-for']:[]}},rateLimit:{enabled:false},logger:{disabled:true},databaseHooks:{session:{create:{before:async session=>{const user=await getDb().user.findFirst({where:{id:session.userId,status:'ACTIVE',deletedAt:null,roles:{some:{role:{permissions:{some:{permission:{key:'dashboard.read'}}}}}}},select:{id:true}});return !!user;}}}}});}
let auth:ReturnType<typeof createAuth>|undefined;
export function getAuth(){return auth??=createAuth();}
