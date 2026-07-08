import { createClient } from "redis";
import dotenv from "dotenv";
import config from ".";

dotenv.config();

const redisClient = createClient({
  url: config.REDIS_CONNECTION,
});

redisClient.on('connect', () => {
  console.log('✅ Redis Connected');
});

redisClient.on('ready', () => {
  console.log('🚀 Redis Ready');
});

redisClient.on('reconnecting', () => {
  console.log('🔄 Redis Reconnecting...');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Error:', err);
});

export default redisClient;