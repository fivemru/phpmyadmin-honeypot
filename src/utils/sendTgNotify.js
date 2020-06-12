const LRU = require('lru-cache');
const { logger } = require('./logger');
const { TG_NOTIFY_CHAT_ID, TG_NOTIFY_SILENT } = require('../config/env');
const { tg } = require('../config/telegram');

// cache
const cache = new LRU({ max: 500, maxAge: 1 * 60 * 60 * 1e3 });

async function sendTgNotify(ip, data) {
  // skip notify
  if (cache.has(ip)) {
    return;
  }

  cache.set(ip, true);

  const msg = `#pma_honeypot #${ip.replace(/[^a-z\d_]+/g, '_')}
  <b>ip:</b> <code>${ip}</code>
  <b>try:</b> <code>${data}</code>`;

  // send message
  await tg
    .sendMessage(TG_NOTIFY_CHAT_ID, msg, {
      parse_mode: 'HTML',
      disable_notification: TG_NOTIFY_SILENT,
    })
    .catch((err) => logger(`sendTgNotify.catch:`, err));
}

module.exports = { sendTgNotify };
