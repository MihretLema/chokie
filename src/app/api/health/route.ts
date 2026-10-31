import {getDb} from '@/server/db/client';
export const dynamic='force-dynamic';
export async function GET(){try{await getDb().$queryRaw`SELECT 1`;return Response.json({success:true,data:{ready:true}},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({success:false,error:{code:'NOT_READY',message:'Backend dependencies are not ready.'}},{status:503,headers:{'Cache-Control':'no-store'}})}}
