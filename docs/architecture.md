
# Backbit Architecture

Backbit is a modular backup platform designed for extensibility, scalability, and separation of concerns. It leverages event-driven communication via RabbitMQ to decouple backup triggers from execution.

---

## 📐 High-Level Components

### 1. API (`/api`)
- Built with .NET Core
- Exposes REST endpoints for:
    - Creating and updating backup schedules
    - Viewing logs and backup history
    - Triggering manual backups
- Publishes scheduling updates or manual triggers to RabbitMQ

### 2. Frontend (`/fe`)
- Built with Angular
- Interfaces with the API for:
    - Managing schedules
    - Monitoring backup status and logs

### 3. Agents

#### a. MySQL Agent (`/agents/mysql`)
- Node.js + TypeScript
- Listens to RabbitMQ events (e.g., `backup:mysql`)
- Executes MySQL backups using `mysqlsh`
- Reports results back via RabbitMQ

#### b. Cronjob Agent (`/agents/cronjob`)
- Node.js + TypeScript
- Uses `node-cron` to schedule backup triggers
- Sends trigger messages to RabbitMQ based on defined cron patterns

### 4. Messaging Layer
- **RabbitMQ**
- Acts as the central message bus between API, agents, and schedulers
- Allows for asynchronous, decoupled communication

---

## 🔁 Flow Overview

```plaintext
+----------+       +----------+       +------------+       +------------+
| Frontend | <---> |   API    | <---> |  RabbitMQ  | <---> |   Agents   |
+----------+       +----------+       +------------+       +------------+
                                  ⬇                     ⬆
                       [cron trigger]         [backup status/logs]
```

---

## 🔧 Technologies Used

| Component | Technology        |
|-----------|-------------------|
| API       | .NET Core         |
| Frontend  | Angular           |
| Agents    | Node.js (TypeScript) |
| Messaging | RabbitMQ          |
| Database  | MySQL             |

---

## 🧩 Extensibility

Future agents can be added under the `agents/` directory to support:
- File-based backups

---

## 🔐 Security Considerations

- API should be protected via authentication/authorization middleware
- Message queues must be secured and not publicly exposed
- Backup output should support encryption & integrity validation

---

