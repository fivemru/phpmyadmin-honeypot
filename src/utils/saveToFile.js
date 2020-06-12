const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { logger } = require('../utils/logger');
const { sendTgNotify } = require('./sendTgNotify');
const { getRequestInfo } = require('./logRequest');
const { SAVE_REQUEST = false, LOGS_DIR } = require('../config/env');

async function writeLineToFile(filepath = `${LOGS_DIR}/output.log`, data = '') {
  return new Promise((resolve) => {
    const log = fs.createWriteStream(filepath, { flags: 'a' });
    log.write(`${data}\n`, () => {
      log.end(resolve);
    });
  });
}

async function makeClientLogDir(userIp) {
  let ip = 'unknown_ip';

  if (userIp) {
    ip = userIp.replace(/[.:]+/g, '_');
  }

  const datePath = dayjs().format('YYYY/MM-DD');
  const currLogDir = path.join(LOGS_DIR, datePath, ip);

  // create dir
  await fs.promises.mkdir(currLogDir, { recursive: true });
  return currLogDir;
}

async function saveRequest(req, err) {
  const clientLogDir = await makeClientLogDir(req.realIp);
  const errorLogPath = path.join(clientLogDir, './error.txt');
  const requestLogPath = path.join(clientLogDir, './request.txt');

  // save request
  if (SAVE_REQUEST && req && req.header) {
    const cookies = JSON.stringify(req.cookies);
    const query = JSON.stringify(req.query);
    const body = JSON.stringify(req.body);

    let reqData = getRequestInfo(req);
    reqData += ` query: ${query} body: ${body} cookies: ${cookies}`;
    await writeLineToFile(requestLogPath, reqData.substr(0, 4000));
  }

  // save error
  if (err && err.message) {
    const ts = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
    const errData = `[${ts}] [${err.code}]  ${err.message}  stack: ${err.stack}`;
    await writeLineToFile(errorLogPath, errData.substr(0, 4000));
  }
}

async function saveAuthAttempt(req) {
  try {
    const clientLogDir = await makeClientLogDir(req.realIp);
    const credentialsLogPath = path.join(clientLogDir, './credentials.txt');

    const login = req.body.pma_username || '';
    const pass = req.body.pma_password || '';

    if (login || pass) {
      const data = `${login}:${pass}`;
      sendTgNotify(req.realIp, data);
      await writeLineToFile(credentialsLogPath, data.substr(0, 4000));
    }
  } catch (err) {
    logger('logAuthAttempt.catch', err);
  }
}

module.exports = { saveRequest, saveAuthAttempt };
