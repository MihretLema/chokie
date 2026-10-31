import {pageAlias} from '@/server/api';
export function GET(request:Request){return pageAlias(request,'home',true);}
export const PATCH=GET;

