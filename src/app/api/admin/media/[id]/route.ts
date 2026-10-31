import {media} from '@/server/api';
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){return media(request,(await params).id);}
export const DELETE=PATCH;

