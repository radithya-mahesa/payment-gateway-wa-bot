# watools-topup

A simple WhatsApp bot using [Baileys](https://github.com/WhiskeySockets/Baileys) that allows users to request top-up transactions through commands.

## Features

- Automatically connects to WhatsApp via pairing code.
- Supports a custom `!topup` command.
- Prevents usage in group chats.
- Sends all top up products list details.
- Sends payment QR code with transaction details.
- Uses external API from a payment gateway.

## Command
Show all products list
```
!topup
```

For the payment process 

```
!topup <nominal_id> <account_id>
```

**Example:**

```
!topup 5 12345678
```

---

## Getting Started

### 1. Install Dependencies (for non-Docker use)

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root project folder:

```env
PHONE_NUMBER=62xxxxxxxxxx
PAYMENT_GATEWAY=https://your-gateway-url.com/endpoint
API_PRODUCT_LIST=https://your-api-products.com/endpoint
```

> ⚠️ The `PHONE_NUMBER` must be in international format (without the `+` sign).

### 3. Run the program
```bash
node index.js
```
You will see something like:

```
[dotenv@17.2.1] injecting env (0) from .env -- tip: 📡 auto-backup env with Radar: https://dotenvx.com/radar
🔑 Pairing code: KWR9LBQJ
👉 Buka WhatsApp > Linked Devices > "Link a device" > "Link with phone number instead"
ℹ️ Atau bisa juga buka lewat pesan notifikasi dari WhatsApp
```
---

## Run With Docker (Recommended)

1. Make sure Docker and Docker Compose are installed.
2. Ensure your `.env` file exists in the root project.
3. Build and start the container in detached mode:

```bash
docker compose up -d --build
```

4. To view the pairing code, run:

```bash
docker compose logs watools-topup
```

You will see something like:

```
[dotenv@17.2.1] injecting env (0) from .env -- tip: 📡 auto-backup env with Radar: https://dotenvx.com/radar
🔑 Pairing code: KWR9LBQJ
👉 Buka WhatsApp > Linked Devices > "Link a device" > "Link with phone number instead"
ℹ️ Atau bisa juga buka lewat pesan notifikasi dari WhatsApp
```

---

## Troubleshooting

- If the bot does not connect, or you're debugging issues, always **delete the `auth_info/` folder** inside the project root.
- This folder contains session/auth state; deleting it will force re-pairing.

```bash
rm -rf auth_info
```

✅ *Remember to clean up `auth_info/` regularly to avoid issues with stale sessions.*

---

## Project Structure

```
.
├── auth_info/         # WhatsApp auth state (auto created)
├── index.js           # Main bot logic and connection
├── handler.js         # Message handling & commands
├── config.js          # Bot config (e.g., prefix)
├── .env               # Environment variables
├── docker-compose.yml # Docker setup
├── package.json
└── README.md
```

---

## Disclaimer

This project was developed as part of a freelance work and has been approved for public release. Please use it responsibly and ensure you comply with WhatsApp’s terms of service when using Baileys or any unofficial WhatsApp API.

---

## License

MIT License © 2025
