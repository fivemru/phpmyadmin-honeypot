const dayjs = require('dayjs');

function logRequest(req, res, next) {
  const date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
  const ip = req.ip;
  const host = req.header('host') || '-';
  const ua = req.header('user-agent') || '-';
  const ref = req.header('referer') || '-';

  const info = `[${date}] - ${ip} - ${req.realIp} - [${host}] ${req.method} ${req.originalUrl} "${ua}" "${ref}"`;
  console.log(info);

  next();
}

module.exports = logRequest;
