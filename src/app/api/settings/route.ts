import {settings} from '@/server/api';
export function GET(request:Request){return settings(request);}

