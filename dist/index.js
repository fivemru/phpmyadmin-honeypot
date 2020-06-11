const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const pages = require('./routes/pages');
const assets = require('./routes/assets');
const logRequest = require('./utils/logRequest');

const PUBLIC_PATH = path.resolve(__dirname, './public');
const VIEWS_ROOT = path.resolve(__dirname, './views');

const { PORT = 3000, URL_PREFIX = 'phpmyadmin' } = process.env;

const app = express();

app.set('view engine', 'ejs');
app.set('views', VIEWS_ROOT);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// headers
app.use((req, res, next) => {
  res.setHeader('x-powered-by', 'PHP/5.4.16');
  next();
});

// pages
app.use(`/${URL_PREFIX}`, assets, [logRequest, pages]);

// 404
app.use(function (req, res) {
  res.status(404).sendFile(`${PUBLIC_PATH}/404.html`);
});

app.listen(PORT, () => {
  console.log(`app listen port ${PORT}`);
});
