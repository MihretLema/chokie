import {adminBusiness} from '@/server/api';
export function GET(request:Request){return adminBusiness('tickets',request);}

