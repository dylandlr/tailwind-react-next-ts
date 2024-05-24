import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: "https://witty-katydid-35644.upstash.io",
  token: process.env.UPSTASH_REDIS_REST_TOKEN!, // from .env - This is the secret token which we grab from the Upstash dashboard
});

// const data = await redis.set("foo", "bar");
