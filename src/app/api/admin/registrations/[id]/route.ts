import {adminBusiness} from '@/server/api';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return adminBusiness('registrations',request,(await params).id);}
export const PATCH=GET;

