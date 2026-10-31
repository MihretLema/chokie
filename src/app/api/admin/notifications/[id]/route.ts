import {notifications} from '@/server/api';
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){return notifications(request,(await params).id);}

