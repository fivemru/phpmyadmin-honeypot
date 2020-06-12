const express = require('express');
const { PUBLIC_PATH } = require('../config/env');

const router = express.Router();

function updateHeaders(req, res, next) {
  res.removeHeader('x-powered-by');
  next();
}

const staticFiles = [
  '/favicon.ico',
  '/themes/dot.gif',
  '/themes/pmahomme/img/logo_right.png',
  '/themes/pmahomme/img/sprites.png',
  '/themes/pmahomme/jquery/jquery-ui-1.11.2.css',
];

router.get(staticFiles, updateHeaders, (req, res, next) => {
  if (staticFiles.includes(req.path)) {
    return res.sendFile(`${PUBLIC_PATH}${req.path}`);
  }
  next();
});

router.get('/phpmyadmin.css.php', (req, res) => {
  res.sendFile(`${PUBLIC_PATH}/phpmyadmin.css`);
});

router.get('/js/whitelist.php', (req, res) => {
  res.sendFile(`${PUBLIC_PATH}/js/whitelist.js`);
});

router.get('/js/messages.php', (req, res) => {
  res.sendFile(`${PUBLIC_PATH}/js/messages.js`);
});

router.get('/js/get_image.js.php', (req, res) => {
  res.sendFile(`${PUBLIC_PATH}/js/get_image.js`);
});

router.get('/js/get_scripts.js.php', (req, res, next) => {
  const { scripts } = req.query;

  if (!scripts || !scripts.length || !Array.isArray(scripts)) {
    return next();
  }

  const root = `${PUBLIC_PATH}/js/get_scripts`;

  const scriptDict = {
    'jquery/jquery-1.11.1.min.js': `${root}/script1.js`,
    'jquery/jquery.debounce-1.0.5.js': `${root}/script2.js`,
    'common.js': `${root}/script3.js`,
  };

  // script 1, 2, 3
  for (const scriptPath in scriptDict) {
    if (scripts.includes(scriptPath)) {
      return res.sendFile(scriptDict[scriptPath]);
    }
  }

  next();
});

module.exports = router;
