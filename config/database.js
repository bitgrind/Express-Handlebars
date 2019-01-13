if(process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://admin:adminAdmin1@ds119853.mlab.com:19853/pstv-db'}
} else {
  module.exports = {
    mongoURI: 'mongodb://localhost/pstvdb'
  }
}