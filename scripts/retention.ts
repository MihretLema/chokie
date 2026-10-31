import 'dotenv/config';
import {retentionPreview,applyRetention} from '../src/server/services/retention';
import {getDb} from '../src/server/db/client';
try{console.log(process.argv.includes('--apply')?await applyRetention():await retentionPreview())}finally{await getDb().$disconnect()}
