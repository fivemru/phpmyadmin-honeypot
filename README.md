# phpmyadmin honeypot

> A simple nodejs application that shows the login form in phpmyadmin.
>
> After sending the form with any login / password, a message with this data is sent to the Telegram messenger.

> If you have noticed phpmyadmin requests from different ip in your server’s logs many times, but your server doesn’t have php or mysql or phpmyadmin and you wondered what would happen if you give them what they are looking for. Will there be login attempts, and if so, what will they try to enter into the form.

## Usage

Rename `.env.examples` to `.env` and and configure.
Fill the `TG_BOT_TOKEN` and `TG_NOTIFY_CHAT_ID` keys with your telegram bot api token and chat/-channel id.

### With docker

Build production image and run it.

```bash
# build prod image
docker-compose -f ./docker-compose.dev.yml build --no-cache prod
# launch prod image
docker-compose -f ./docker-compose.yml up -d
```

### Without docker

```bash
npm install
npm run start
```

## Checkout

**Step 1:**

Go to `http://localhost:3000/phpmyadmin/`, fill and submit the form.
Check out the `logs/**/*.log` files and your telegram chat.

**Step 2 (optional):**

Configure your nginx using the example from the `nginx_example.conf` file.
