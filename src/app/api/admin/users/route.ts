import {users} from '@/server/api';
export function GET(request:Request){return users(request);}
export const POST=GET;

