import {outbox} from '@/server/api';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){return outbox(request,(await params).id);}

