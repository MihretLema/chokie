import {adminContent} from '@/server/api';
export function GET(request:Request){return adminContent('partners',request);}
export const POST=GET;

