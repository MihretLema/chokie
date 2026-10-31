import {outbox} from '@/server/api';
export function GET(request:Request){return outbox(request);}


