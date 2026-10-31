import {media} from '@/server/api';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return media(request,(await params).id,true,true);}

