function defineRealIp(req, res, next) {
  const ip = req.header('cf-connecting-ip') || req.ip || '';
  req.realIp = ip;
  next();
}

module.exports = { defineRealIp };
