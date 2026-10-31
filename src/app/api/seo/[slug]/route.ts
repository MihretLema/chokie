import {publicSeo} from '@/server/api';
export async function GET(request:Request,{params}:{params:Promise<{slug:string}>}){return publicSeo(request,(await params).slug);}

