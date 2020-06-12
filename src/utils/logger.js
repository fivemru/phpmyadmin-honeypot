function logger(...args) {
  console.log.apply(null, args);
}

module.exports = { logger };
