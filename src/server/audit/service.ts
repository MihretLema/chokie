import type {Prisma} from '@/generated/prisma/client';
import {getDb} from '../db/client';
export type AuditInput={actorId?:string|null;action:string;resourceType:string;resourceId?:string;outcome?:'SUCCESS'|'FAILURE';metadata?:Record<string,string|number|boolean|string[]|null>};
export async function audit(tx:Prisma.TransactionClient,input:AuditInput){return tx.auditLog.create({data:{actorId:input.actorId||null,action:input.action,resourceType:input.resourceType,resourceId:input.resourceId,outcome:input.outcome||'SUCCESS',metadata:(input.metadata||{}) as Prisma.InputJsonValue}});}
export async function auditEvent(input:AuditInput){return audit(getDb(),input);}
