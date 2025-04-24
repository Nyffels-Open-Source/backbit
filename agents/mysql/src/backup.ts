import { spawn } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const DB_NAME = process.env.MYSQL_DB || 'database';
const DB_USER = process.env.MYSQL_USER || 'root';
const DB_PASSWORD = process.env.MYSQL_PASSWORD || 'password';
const OUTPUT_DIR = './backups';

export async function executeBackup(): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const folderName = join(OUTPUT_DIR, `${DB_NAME}-backup-${timestamp}`);

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    const cmd = 'mysqlsh';
    const args = [
      '--uri', `${DB_USER}:${DB_PASSWORD}@localhost`,
      '--',
      'util',
      'dumpSchema',
      DB_NAME,
      folderName
    ];

    const proc = spawn(cmd, args);

    proc.stdout.on('data', data => console.log(`[backup] ${data}`));
    proc.stderr.on('data', data => console.error(`[backup error] ${data}`));

    proc.on('close', (code) => {
      if (code === 0) {
        console.log(`[backup] Backup completed: ${folderName}`);
        resolve();
      } else {
        reject(new Error(`Backup failed with code ${code}`));
      }
    });
  });
}