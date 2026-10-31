import {adminContent} from '@/server/api';
export function GET(request:Request){return adminContent('testimonials',request);}
export const POST=GET;

