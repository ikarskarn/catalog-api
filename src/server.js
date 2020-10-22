const express = require('express');
//const app = require('./app');
//const { PORT } = require('./config');
const app = express();

const PORT = process.env.PORT || 8000;

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.get('/api/*', (req, res) => {
  res.json({ok: true});
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};