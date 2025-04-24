import amqp from 'amqplib';
import { executeBackup } from './backup.js';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const MYSQL_BACKUP_QUEUE_NAME = 'mysql-backup:trigger';

export async function listenForBackupRequests() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(MYSQL_BACKUP_QUEUE_NAME, { durable: true });

  channel.consume(MYSQL_BACKUP_QUEUE_NAME, async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());
      if (content.type === 'backup:mysql') {
        console.log('[mysql-agent] Received MySQL backup request...');
        await executeBackup();
        channel.ack(msg);
      } else {
        channel.nack(msg, false, false);
      }
    } catch (err) {
      console.error('[mysql-agent] Failed to process message:', err);
      channel.nack(msg, false, false);
    }
  });

  console.log(`[mysql-agent] Listening on queue: ${MYSQL_BACKUP_QUEUE_NAME}`);
}