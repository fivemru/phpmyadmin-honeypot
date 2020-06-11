const express = require('express');
const nanoid = require('nanoid');
const { addPMACookies } = require('../utils/addPMACookies');
const { saveAuthAttempt } = require('../utils/saveToFile');

const mockMD5 = nanoid.customAlphabet('abcdef0123456789', 32);

const router = express.Router();

router.get('/url.php', (req, res) => {
  res.redirect('https://www.phpmyadmin.net/');
});

router.get('/index.php', addPMACookies, (req, res) => {
  res.redirect('./');
});

router.get('/', addPMACookies, (req, res) => {
  const token = mockMD5();
  res.render('main', { token });
});

router.post(/\/(index\.php)?/, addPMACookies, async (req, res) => {
  // save pma cookie
  const pmaCookie = (req.cookies.phpMyAdmin || '').replace(/[^a-z0-9]+/g, '');
  if (pmaCookie && pmaCookie.length === 32) {
    res.cookie('phpMyAdmin', pmaCookie, { httpOnly: true });
  }

  // save attempt
  await saveAuthAttempt(req);

  const token = mockMD5();
  const { pma_username = '' } = req.body || {};
  res.render('wrongPass', { token, pma_username });
});

module.exports = router;
