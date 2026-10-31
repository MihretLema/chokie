import {pageAlias} from '@/server/api';
export function GET(request:Request){return pageAlias(request,'about');}

