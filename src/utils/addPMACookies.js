const nanoid = require('nanoid');

const mockPMACookie = nanoid.customAlphabet(
  'abcdefghijklmnopqrstuvwxyz0123456789',
  32
);

function addPMACookies(req, res, next) {
  const phpMyAdmin = mockPMACookie();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3);
  const options = { httpOnly: true };
  const optionsExp = { ...options, expires };

  res.cookie('phpMyAdmin', phpMyAdmin, options);
  res.cookie('pma_collation_connection', 'utf8_unicode_ci', optionsExp);
  res.cookie('pma_lang', 'en', optionsExp);

  next();
}

module.exports = addPMACookies;
