import {adminContent} from '@/server/api';
export function GET(request:Request){return adminContent('case-studies',request);}
export const POST=GET;

