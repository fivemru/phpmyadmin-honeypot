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
  const token = mockMD5();
  res.render('main', { token });
});

router.post(/\/(index\.php)?/, (req, res) => {
  // params
  const { pma_username = '' } = req.body || {};
  console.log('POST', req.body);
  // pma_username: testUser
  // pma_password: testPass
  // server: 1
  // target: index.php
  // token: 84549e950496b70673f14775e4c07ebf

  const token = mockMD5();
  res.render('wrongPass', { token, pma_username });
});

module.exports = router;
