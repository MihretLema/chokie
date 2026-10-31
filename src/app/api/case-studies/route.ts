import {publicContent} from '@/server/api';
export function GET(request:Request){return publicContent('case-studies',request);}

