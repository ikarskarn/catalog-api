module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://marcttucker@localhost/catalog',
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'postgresql://marcttucker@localhost/catalog',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://marcttucker@localhost/catalog'
}