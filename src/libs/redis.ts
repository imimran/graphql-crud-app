import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost', // Your Redis server host
  port: 6379, // Your Redis server port
});

export default redis;