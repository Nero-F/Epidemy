const redis = require('redis');
const async_redis = require('async-redis');
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
require('dotenv').config();
const async_client = async_redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
const student_map = require('../../student_map.json');

client.on('error', (error) => {
    console.error(error);
});

async_client.on('error', (error) => {
    console.error(error);
});

// store student id and mail as KVP in redis cache
// this happense at every instantiation of the app (TODO: check if other solution exists)
const set_students_db = () => {
    console.log('setting up student Database...');
    student_map.promos.forEach(year => {
        year.students.forEach(stud => {
            client.set(stud.id, stud.mail);
        });
    });
    console.log('setting up done');
}

set_students_db();

module.exports = {client, async_client};
