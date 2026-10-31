import {submit} from '@/server/api';
export function POST(request:Request){return submit('inquiries',request);}

