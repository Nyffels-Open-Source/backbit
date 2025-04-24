import cron from 'node-cron';
import { publishBackupTrigger } from './publisher.js';

export function initScheduler() {
  // Every minute, this is for testing. 
  cron.schedule('* * * * *', async () => {
    console.log('[cronjob] Triggering scheduled backup event...');
    await publishBackupTrigger();
  });
}