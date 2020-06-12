const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const { PORT, MOUNT_URL = '/phpmyadmin/' } = require('./config/env');
const { logRequest } = require('./utils/logRequest');
const { saveRequest } = require('./utils/saveToFile');
const { defineRealIp } = require('./utils/defineRealIp');
const pages = require('./routes/pages');
const assets = require('./routes/assets');

const PUBLIC_PATH = path.resolve(__dirname, '../public');
const VIEWS_DIR = path.resolve(__dirname, './views');

const app = express();

app.use(defineRealIp);
app.set('view engine', 'ejs');
app.set('views', VIEWS_DIR);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// headers
app.use((req, res, next) => {
  res.setHeader('x-powered-by', 'PHP/5.4.16');
  next();
});

// redirect all requests to mount url
app.use((req, res, next) => {
  if (!req.originalUrl.startsWith(MOUNT_URL)) {
    return res.redirect(`${MOUNT_URL}`);
  }
  next();
});

// pages
app.use(MOUNT_URL, assets, [logRequest, pages]);

// 404
app.use(async (req, res) => {
  await saveRequest(req);
  res.status(404).sendFile(`${PUBLIC_PATH}/404.html`);
});

// 500
// eslint-disable-next-line no-unused-vars
app.use(async (err, req, res, next) => {
  await saveRequest(req, err);
  res.status(404).sendFile(`${PUBLIC_PATH}/404.html`);
});

// global
process.on('unhandledRejection', async (err) => {
  console.log('unhandledRejection', err);
  await saveRequest(null, err);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`app listen port ${PORT}`);
});
