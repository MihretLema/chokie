import 'dotenv/config';
import {processOutbox} from '../src/server/email/outbox';
import {getDb} from '../src/server/db/client';
let running=true;process.on('SIGINT',()=>{running=false});process.on('SIGTERM',()=>{running=false});
try{do{const result=await processOutbox(20);console.log('Outbox batch:',result);if(process.argv.includes('--once'))break;await new Promise(resolve=>setTimeout(resolve,5000));}while(running)}finally{await getDb().$disconnect()}
