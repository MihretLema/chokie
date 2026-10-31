import {defineConfig} from 'vitest/config';
import {resolve} from 'node:path';
export default defineConfig({resolve:{alias:{'@':resolve('src'),'server-only':resolve('tests/backend/server-only.ts')}},test:{environment:'node',include:['tests/backend/**/*.test.ts'],fileParallelism:false,maxWorkers:1,testTimeout:30000,hookTimeout:90000}});
