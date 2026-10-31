import {adminBusiness} from '@/server/api';
export function GET(request:Request){return adminBusiness('consultations',request);}

