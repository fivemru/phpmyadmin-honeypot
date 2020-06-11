const express = require('express');
const nanoid = require('nanoid');

const mockMD5 = nanoid.customAlphabet('abcdef0123456789', 32);

const router = express.Router();

router.get('/url.php', (req, res) => {
  res.redirect('https://www.phpmyadmin.net/');
});

router.get('/index.php', (req, res) => {
  res.redirect('./');
});

router.get('/', (req, res) => {
  console.log('main pagec');
  const token = mockMD5();
  res.render('main', { token });
});

module.exports = router;
