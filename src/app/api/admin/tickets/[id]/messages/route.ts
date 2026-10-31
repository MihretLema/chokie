import {adminBusiness} from '@/server/api';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return adminBusiness('tickets',request,(await params).id,true);}

