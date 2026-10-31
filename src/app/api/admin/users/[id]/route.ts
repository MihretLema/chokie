import {users} from '@/server/api';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){return users(request,(await params).id);}
export const PATCH=GET;

