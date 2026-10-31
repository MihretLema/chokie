import {publicContent} from '@/server/api';
export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}){return publicContent('services',request,(await params).slug);}

