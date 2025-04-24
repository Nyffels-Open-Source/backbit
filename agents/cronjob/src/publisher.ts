import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const MYSQL_BACKUP_QUEUE_NAME = 'backup:trigger';

export async function publishBackupTrigger() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(MYSQL_BACKUP_QUEUE_NAME, { durable: true });

  const message = {
    type: 'backup:mysql',
    timestamp: new Date().toISOString(),
  };

  channel.sendToQueue(MYSQL_BACKUP_QUEUE_NAME, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`[cronjob] Backup event published to "${MYSQL_BACKUP_QUEUE_NAME}"`);

  await channel.close();
  await conn.close();
}