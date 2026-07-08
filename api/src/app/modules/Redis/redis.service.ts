import redisClient from "../../config/RedisClient";

const set = async (
  key: string,
  value: string,
  expireInSeconds?: number,
) => {
  if (expireInSeconds) {
    return redisClient.set(key, value, {
      EX: expireInSeconds,
    });
  }

  return redisClient.set(key, value);
};

const get = async (key: string) => {
  return redisClient.get(key);
};

const del = async (key: string) => {
  return redisClient.del(key);
};

export const RedisService = {
  set,
  get,
  del,
};