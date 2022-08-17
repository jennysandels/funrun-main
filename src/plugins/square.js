const { ApiError, Client, Environment } = require('square');
const { SQUARE_ACCESS_TOKEN } = require('../config/development')

const client = new Client({
    environment: Environment.Sandbox,
    accessToken: SQUARE_ACCESS_TOKEN,
});

module.exports = { ApiError, client };