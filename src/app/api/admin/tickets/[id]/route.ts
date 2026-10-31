import {adminBusiness} from '@/server/api';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return adminBusiness('tickets',request,(await params).id);}
export const PATCH=GET;

