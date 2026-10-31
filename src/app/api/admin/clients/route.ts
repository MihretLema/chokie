import {adminContent} from '@/server/api';
export function GET(request:Request){return adminContent('clients',request);}
export const POST=GET;

