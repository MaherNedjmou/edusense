const { createClient } = require("redis");

const client = createClient(); // localhost:6379

client.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await client.connect();
})();

const queueKey = "myQueue";

const MAX_SIZE = 5;

async function pushToQueue(value) {
  await client.rPush(queueKey, value);


  await client.lTrim(queueKey, -MAX_SIZE, -1); 

  console.log("Queue updated:", await client.lRange(queueKey, 0, -1));
}

(async () => {
  for (let i = 1; i <= 8; i++) {
    await pushToQueue(`task-${i}`);
  }
})();
