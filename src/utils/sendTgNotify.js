const LRU = require('lru-cache');

const options = {
  max: 500,
  maxAge: 1 * 60 * 60 * 1e3,
};

const cache = new LRU(options);

function sendTgNotify(ip, data) {
  // skip notify
  if (cache.has(ip)) {
    return;
  }

  cache.set(ip, true);

  const msg = `ip: <code>${ip}</code>, try <code>${data}</code>`;
  console.log('notify', msg);
}

module.exports = { sendTgNotify };
