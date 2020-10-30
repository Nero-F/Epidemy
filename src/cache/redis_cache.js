const redis = require('redis');
const async_redis = require('async-redis');
const client = redis.createClient();
const async_client = async_redis.createClient();

client.on('error', (error) => {
    console.error(error);
})

async_client.on('error', (error) => {
    console.error(error);
})
module.exports = {client, async_client};
