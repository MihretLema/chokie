import {passwordEndpoint} from '@/server/api';
export function POST(request:Request){return passwordEndpoint(request,'reset');}

