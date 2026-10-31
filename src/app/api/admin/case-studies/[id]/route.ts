import {adminContent} from '@/server/api';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return adminContent('case-studies',request,(await params).id);}
export const PATCH=GET;
export const DELETE=GET;

