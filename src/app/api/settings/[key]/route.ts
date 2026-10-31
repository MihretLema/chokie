import {settings} from '@/server/api';
export async function GET(request:Request,{params}:{params:Promise<{key:string}>}){return settings(request,false,(await params).key);}

