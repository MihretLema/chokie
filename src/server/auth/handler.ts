import {z} from 'zod';
import {getAuth} from './config';
import {principal} from './principal';
import {getDb} from '../db/client';
import {api,success,jsonBody,checkOrigin} from '../utils/http';
import {limit,requestIdentity} from '../utils/rate-limit';
import {ApiError} from '../utils/errors';
import {auditEvent} from '../audit/service';
import {email} from '../validators/schemas';
function authResponse(data:unknown,response:Response){const headers=new Headers(response.headers);headers.delete('content-length');headers.delete('content-encoding');headers.set('Cache-Control','no-store');headers.set('Content-Type','application/json');return new Response(JSON.stringify({success:true,data,message:'Operation completed successfully'}),{status:200,headers});}
export function authHandler(request:Request,path:string){return api(async()=>{
if(path==='get-session'&&request.method==='GET'){const actor=await principal(request.headers,true);return success({user:{id:actor.id,name:actor.name,email:actor.email,roles:actor.roles,passwordChangeRequired:actor.passwordChangeRequired},permissions:[...actor.permissions]})}
if(request.method!=='POST'||!['sign-in/email','sign-out'].includes(path))throw new ApiError(404,'NOT_FOUND','Authentication endpoint not found.');checkOrigin(request);
if(path==='sign-in/email'){const input=z.object({email,password:z.string().min(1).max(128)}).strict().parse(await jsonBody(request));await limit('login-ip:'+requestIdentity(request),30,900);await limit('login-account:'+input.email,5,900);const response=await getAuth().handler(new Request(request.url,{method:'POST',headers:request.headers,body:JSON.stringify(input)}));if(!response.ok){await auditEvent({action:'LOGIN_FAILED',resourceType:'Authentication',outcome:'FAILURE'});throw new ApiError(401,'INVALID_CREDENTIALS','The email or password is incorrect, or the account is unavailable.');}const raw=await response.clone().json() as {user?:{id:string;name:string;email:string}};if(!raw.user)throw new ApiError(401,'INVALID_CREDENTIALS','Sign in could not be completed.');const user=await getDb().user.findUniqueOrThrow({where:{id:raw.user.id},select:{id:true,name:true,email:true,passwordChangeRequired:true}});await auditEvent({actorId:user.id,action:'LOGIN_SUCCEEDED',resourceType:'Authentication',resourceId:user.id});return authResponse({user},response);}
let actorId:string|undefined;try{actorId=(await principal(request.headers,true)).id}catch{/* Signing out also clears stale cookies. */}const response=await getAuth().handler(request);if(actorId)await auditEvent({actorId,action:'LOGOUT',resourceType:'Authentication',resourceId:actorId});return authResponse({signedOut:true},response);
});}
