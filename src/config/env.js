const fs = require('fs');
const path = require('path');

const fields = [
  'PORT',
  'TG_BOT_TOKEN',
  'TG_NOTIFY_CHAT_ID',
  'TG_NOTIFY_SILENT',
  'MOUNT_PATH',
  'SAVE_REQUEST',
];
const env = {};

const valueMap = {
  true: true,
  false: false,
};

for (const key of fields) {
  let value = process.env[key];

  if (typeof value !== 'string') {
    throw new Error(`env var ${key} is not defined!`);
  }

  value = value.replace(/^(['"])(.*)\1$/, '$2');

  if (value === '') {
    throw new Error(`env var ${key} is empty!`);
  }

  if (typeof valueMap[value] !== 'undefined') {
    value = valueMap[value];
  }

  env[key] = value;
}

env.PUBLIC_PATH = path.resolve(__dirname, '../../public');

// log dir
fs.createWriteStream;
env.LOGS_DIR = path.resolve(__dirname, '../../logs');
fs.promises.mkdir(env.LOGS_DIR, { recursive: true });

module.exports = { ...env, env };
