import {adminContent} from '@/server/api';
export function GET(request:Request){return adminContent('training',request);}
export const POST=GET;

