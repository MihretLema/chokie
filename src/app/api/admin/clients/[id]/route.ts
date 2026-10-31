import {adminContent} from '@/server/api';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return adminContent('clients',request,(await params).id);}
export const PATCH=GET;
export const DELETE=GET;

