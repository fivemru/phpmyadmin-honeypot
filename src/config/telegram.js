const Telegraf = require('telegraf');
const { TG_BOT_TOKEN } = require('./env');

const tgBot = new Telegraf(TG_BOT_TOKEN, {
  telegram: { webhookReply: false },
});

tgBot.webhookReply = false;

const tg = tgBot.telegram;

module.exports = { tg, tgBot };
