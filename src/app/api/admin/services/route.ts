import {adminContent} from '@/server/api';
export function GET(request:Request){return adminContent('services',request);}
export const POST=GET;

