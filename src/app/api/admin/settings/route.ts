import {settings} from '@/server/api';
export function GET(request:Request){return settings(request,true);}
export const POST=GET;
export const PATCH=GET;

