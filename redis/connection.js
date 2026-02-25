import redis from "redis";

export const client = redis.createClient({
  url: "redis://redis:6379"  // directly points to the Redis container
});



client.on("error", function(err) {
    console.log("Redis error:", err);
});

export async function connectRedis() {
    await client.connect();
    console.log("Redis connected");
}
