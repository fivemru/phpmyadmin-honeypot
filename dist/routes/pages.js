const express = require('express');
const nanoid = require('nanoid');
const addPMACookies = require('../utils/addPMACookies');

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

router.post(/\/(index\.php)?/, addPMACookies, (req, res) => {
  // save pma cookie
  const pmaCookie = (req.cookies.phpMyAdmin || '').replace(/[^a-z0-9]+/g, '');
  if (pmaCookie && pmaCookie.length === 32) {
    res.cookie('phpMyAdmin', pmaCookie, { httpOnly: true });
  }

  // params
  const { pma_username = '' } = req.body || {};
  // pma_username: testUser
  // pma_password: testPass

  const token = mockMD5();
  res.render('wrongPass', { token, pma_username });
});

module.exports = router;
