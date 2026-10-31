import {hash,verify} from '@node-rs/argon2';
const options={algorithm:2 as const,memoryCost:65536,timeCost:3,parallelism:1,outputLen:32}; // Argon2id
export const hashPassword=(password:string)=>hash(password,options);
export async function verifyPassword(encoded:string,password:string){try{return encoded.startsWith('$argon2id$')&&await verify(encoded,password)}catch{return false}}
