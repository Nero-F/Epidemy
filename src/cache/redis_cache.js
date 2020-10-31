const redis = require('redis');
const async_redis = require('async-redis');
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
require('dotenv').config();
const async_client = async_redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

client.on('error', (error) => {
    console.error(error);
});

async_client.on('error', (error) => {
    console.error(error);
});
module.exports = {client, async_client};
