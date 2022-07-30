var env = process.env.NODE_ENV || 'development'

var config = {
    development: require('./config/development.js'),
    production: require('./config/production.js'),
    test: require('./config/testing.js')
}

module.exports = config[env]