const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { sendTgNotify } = require('./sendTgNotify');

fs.createWriteStream;
const root = path.resolve(__dirname, '../../logs');

fs.promises
  .mkdir(root, { recursive: true })
  .catch((err) => console.log('mkdir.catch: ', err));

async function writeLineToFile(filepath = `${root}/output.log`, data = '') {
  return new Promise((resolve) => {
    const log = fs.createWriteStream(filepath, { flags: 'a' });
    log.write(`${data}\n`, () => {
      log.end(resolve);
    });
  });
}

function removeFields(fileds = [], data) {
  const res = { ...data };

  for (let key of fileds) {
    if (res[key]) {
      delete res[key];
    }
  }

  return res;
}

async function getCurrLogDir(req) {
  let ip = 'unknown_ip';

  if (req && req.header && req.reqlIp) {
    ip = req.realIp.replace(/[.:]+/g, '_');
  }

  const datePath = dayjs().format('YYYY/MM-DD');
  const currLogDir = path.join(root, datePath, ip);

  // create dir
  await fs.promises.mkdir(currLogDir, { recursive: true });
  return currLogDir;
}

async function saveRequest(req, err) {
  const currLogDir = await getCurrLogDir(req);
  const reqPath = path.join(currLogDir, './req.txt');
  const errPath = path.join(currLogDir, './err.txt');
  const ts = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');

  // save req
  if (req && req.header) {
    const host = req.header('host') || '-';
    const query = JSON.stringify(req.query);
    const body = JSON.stringify(req.body);
    const rmFields = ['pma_collation_connection', 'pma_lang', 'phpMyAdmin'];
    const cookies = JSON.stringify(removeFields(rmFields, req.cookies));

    const reqData = `${ts}  host: ${host} method: ${req.method} originalUrl: ${req.originalUrl} query: ${query} body: ${body} cookies: ${cookies}`;
    await writeLineToFile(reqPath, reqData.substr(0, 4000));
  }

  // save error
  if (err && err.message) {
    const errData = `[${ts}] [${err.code}]  ${err.message}  stack: ${err.stack}`;
    await writeLineToFile(errPath, errData.substr(0, 4000));
  }
}

async function saveAuthAttempt(req) {
  try {
    const currLogDir = await getCurrLogDir(req);
    const credPath = path.join(currLogDir, './cred.txt');

    const login = req.body.pma_username || '';
    const pass = req.body.pma_password || '';

    if (login || pass) {
      const data = `${login}:${pass}`;

      sendTgNotify(req.realIp, data);

      await writeLineToFile(credPath, data.substr(0, 4000));
    }

    await saveRequest(req);
  } catch (err) {
    console.log('logAuthAttempt.catch', err);
  }
}

module.exports = { saveRequest, saveAuthAttempt };
