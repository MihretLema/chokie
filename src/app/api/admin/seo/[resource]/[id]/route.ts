import {seo} from '@/server/api';
import {contentSchemas,type ContentResource} from '@/server/validators/schemas';
import {api} from '@/server/utils/http';
import {missing} from '@/server/utils/errors';
export async function GET(request:Request,{params}:{params:Promise<{resource:string;id:string}>}){const {resource,id}=await params;if(!(resource in contentSchemas))return api(async()=>{throw missing()});return seo(request,resource as ContentResource,id);}
export const PATCH=GET;

