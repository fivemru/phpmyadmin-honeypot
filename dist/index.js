const express = require('express');

const { PORT = 3000 } = process.env;

const app = express();

app.get('/', (req, res) => {
  console.log('req');
  res.send('hi');
});

app.listen(PORT, () => {
  console.log(`app listen port ${PORT}`);
});
