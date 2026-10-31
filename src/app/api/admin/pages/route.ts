import {adminContent} from '@/server/api';
export function GET(request:Request){return adminContent('pages',request);}
export const POST=GET;

