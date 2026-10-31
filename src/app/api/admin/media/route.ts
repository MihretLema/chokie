import {media} from '@/server/api';
export function GET(request:Request){return media(request);}
export const POST=GET;

