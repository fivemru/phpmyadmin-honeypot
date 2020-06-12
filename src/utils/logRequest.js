const dayjs = require('dayjs');
const { logger } = require('../utils/logger');

function getRequestInfo(req) {
  let info = '';

  if (req && req.header) {
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
    const ip = req.ip;
    const host = req.header('host') || '-';
    const ua = req.header('user-agent') || '-';
    const ref = req.header('referer') || '-';

    info = `[${date}] - ${ip} - ${req.realIp} - [${host}] ${req.method} ${req.originalUrl} "${ua}" "${ref}"`;
  }

  return info;
}

function logRequest(req, res, next) {
  const info = getRequestInfo(req);
  logger(info);
  next();
}

module.exports = { getRequestInfo, logRequest };
