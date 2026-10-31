import {z} from 'zod';
export const uuid=z.uuid();
export const slug=z.string().trim().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const publication=z.enum(['DRAFT','PUBLISHED','ARCHIVED']);
const date=z.union([z.iso.date(),z.iso.datetime()]).transform(v=>new Date(v));
const webUrl=z.url().refine(v=>['https:','http:'].includes(new URL(v).protocol),'Use an http(s) URL.');
export const email=z.email().max(254).transform(v=>v.trim().toLowerCase());
export const password=z.string().min(12).max(128).refine(v=>new TextEncoder().encode(v).length<=512,'Password is too long.');
const short=z.string().trim().min(1).max(250);
const long=z.string().trim().min(1).max(30000);
const optionalText=z.string().trim().max(250).nullable().optional();
const optionalDate=date.nullable().optional();
const ids=z.array(uuid).max(30).refine(v=>new Set(v).size===v.length,'Duplicate related IDs are not allowed.');
const lines=z.array(z.string().trim().min(1).max(1000)).max(50);
export const seoInput=z.object({title:z.string().trim().min(1).max(60),description:z.string().trim().min(1).max(160),canonicalUrl:webUrl.nullable().optional(),ogTitle:z.string().max(150).nullable().optional(),ogDescription:z.string().max(500).nullable().optional(),ogImageId:uuid.nullable().optional(),indexable:z.boolean().optional()}).strict();
const common={slug,status:publication.optional(),displayOrder:z.number().int().min(0).max(100000).optional(),imageId:uuid.nullable().optional()};
const titled={...common,title:short};
const approved={approved:z.boolean().optional()};
const section=z.object({key:slug,type:z.enum(['hero','rich-text','services','solutions','partners','training','cta','values']),heading:z.string().max(250),body:z.string().max(30000),visible:z.boolean().optional(),displayOrder:z.number().int().min(0).max(100000).optional()}).strict();
export const contentSchemas={
services:z.object({...titled,shortDescription:short,description:long,icon:z.enum(['BriefcaseBusiness','ShieldCheck','Network','Workflow','KeyRound','Package','Camera','Phone','Headset']).nullable().optional(),features:lines.optional(),benefits:lines.optional(),relatedServiceIds:ids.optional(),seo:seoInput.optional()}).strict(),
solutions:z.object({...titled,shortDescription:short,description:long,serviceIds:ids.optional(),seo:seoInput.optional()}).strict(),
training:z.object({...titled,description:long,learningObjectives:lines.optional(),targetAudience:optionalText,duration:optionalText,deliveryMode:z.enum(['ONLINE','IN_PERSON','HYBRID']).nullable().optional(),availability:z.enum(['UNKNOWN','OPEN','CLOSED','COMING_SOON']).optional(),startDate:optionalDate,registrationDeadline:optionalDate,seo:seoInput.optional()}).strict(),
partners:z.object({...common,name:short,description:z.string().max(30000),website:webUrl.nullable().optional(),category:optionalText,verified:z.boolean().optional(),...approved}).strict(),
clients:z.object({...common,name:short,description:z.string().max(30000),industry:optionalText,website:webUrl.nullable().optional(),...approved}).strict(),
testimonials:z.object({...common,name:short,quote:long,position:optionalText,organization:optionalText,featured:z.boolean().optional(),clientId:uuid.nullable().optional(),...approved}).strict(),
'case-studies':z.object({...titled,description:long,clientId:uuid.nullable().optional(),seo:seoInput.optional(),...approved}).strict(),
pages:z.object({...titled,sections:z.array(section).max(30).refine(v=>new Set(v.map(s=>s.key)).size===v.length,'Section keys must be unique.').optional(),seo:seoInput.optional()}).strict()
};
export type ContentResource=keyof typeof contentSchemas;
export const personalFields={fullName:z.string().trim().min(2).max(100),email,phone:z.string().trim().max(25).regex(/^[+\d\s().-]*$/).nullable().optional(),organization:optionalText};
const antiSpam={website:z.literal('').optional(),formStartedAt:z.number().int().positive().optional()};
export const contactInput=z.object({...personalFields,serviceInterest:optionalText,subject:short,message:z.string().trim().min(20).max(5000),privacyConsent:z.literal(true),...antiSpam}).strict();
export const consultationInput=z.object({...personalFields,requestedService:optionalText,projectDescription:z.string().trim().min(20).max(5000),preferredContactDate:optionalDate,...antiSpam}).strict();
export const trainingInquiryInput=z.object({...personalFields,programId:uuid,message:z.string().trim().min(10).max(5000),...antiSpam}).strict();
export const ticketInput=z.object({fullName:personalFields.fullName,email,phone:personalFields.phone,serviceCategory:short,subject:short,description:z.string().trim().min(20).max(5000),priority:z.enum(['LOW','NORMAL','HIGH','CRITICAL']).optional(),...antiSpam}).strict();
export const workflowSchemas={inquiries:z.object({status:z.enum(['NEW','IN_REVIEW','CONTACTED','RESOLVED','ARCHIVED']).optional(),assignedToId:uuid.nullable().optional(),note:z.string().trim().min(1).max(5000).optional()}).strict(),consultations:z.object({status:z.enum(['NEW','CONTACTED','SCHEDULED','COMPLETED','CANCELLED']).optional(),assignedToId:uuid.nullable().optional(),note:z.string().trim().min(1).max(5000).optional()}).strict(),registrations:z.object({status:z.enum(['NEW','IN_REVIEW','CONTACTED','RESOLVED','ARCHIVED']).optional(),assignedToId:uuid.nullable().optional(),note:z.string().trim().min(1).max(5000).optional()}).strict(),tickets:z.object({status:z.enum(['NEW','OPEN','IN_PROGRESS','WAITING_FOR_CUSTOMER','RESOLVED','CLOSED']).optional(),priority:z.enum(['LOW','NORMAL','HIGH','CRITICAL']).optional(),assignedToId:uuid.nullable().optional(),note:z.string().trim().min(1).max(5000).optional()}).strict()};
export type WorkflowResource=keyof typeof workflowSchemas;
export const ticketMessageInput=z.object({body:z.string().trim().min(1).max(5000),internal:z.boolean().default(false)}).strict();
export const settingsInput=z.object({key:z.enum(['company','branding','contact','social','footer','seo','notifications']),value:z.record(z.string().min(1).max(60),z.union([z.string().max(10000),z.boolean(),z.array(z.string().max(500)).max(30)])),status:publication.optional()}).strict();
export const userCreateInput=z.object({name:short,email,roles:z.array(z.enum(['Super Admin','Content Manager','Support Agent','Viewer'])).min(1).max(4)}).strict();
export const userUpdateInput=userCreateInput.partial().extend({status:z.enum(['ACTIVE','DISABLED']).optional()}).strict();
export const passwordRequestInput=z.object({email}).strict();
export const passwordResetInput=z.object({token:z.string().regex(/^[A-Za-z0-9_-]{43}$/),password}).strict();
export const passwordChangeInput=z.object({currentPassword:z.string().min(1).max(128),newPassword:password}).strict();
export const mediaUploadInput=z.object({purpose:z.enum(['WEBSITE','TICKET']),visibility:z.enum(['PUBLIC','PRIVATE']).default('PRIVATE'),ticketId:uuid.optional()}).strict();
