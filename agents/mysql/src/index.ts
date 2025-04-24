import { listenForBackupRequests } from './queue.js';

console.log('[mysql-agent] Starting MySQL backup agent...');
listenForBackupRequests();