require('dotenv').config();
const redis = require('redis');
const async_redis = require('async-redis');
const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
const async_client = async_redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
const student_map = require('../student_map.json');

async_client.on('error', (error) => {
    console.error(error);
    throw error;
});

// store student id and mail as KVP in redis cache
// this happense at every instantiation of the app
const set_students_db = () => {
    console.log('setting up student Database...');
    student_map.promos.forEach(year => {
        year.students.forEach(stud => {
            async_client.set(stud.id, stud.mail);
        });
    });
    console.log('setup done.');
}

set_students_db();

module.exports = { client, async_client };
