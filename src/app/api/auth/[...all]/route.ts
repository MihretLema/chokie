import {authHandler} from '@/server/auth/handler';
export async function GET(request:Request,{params}:{params:Promise<{all:string[]}>}){return authHandler(request,(await params).all.join('/'));}
export const POST=GET;

