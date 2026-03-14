const amqp = require("amqplib");

const workerId = process.pid;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const funcA = (a) => {
  a++;
  console.log(`[${workerId}] Function A`, a);
  return a;
}

const funcB = (b) => {
  b++;
  console.log(`[${workerId}] Function B`, b);
  return b;
}

const funcC = (c) => {
  c++;
  console.log(`[${workerId}] Function C`, c);
  return c;
}

async function processTask(x) {

  const start = new Date().toLocaleTimeString();
  console.log(`[${workerId}] START task`, x, "at", start);

  await sleep(5000); 

  x = funcA(x);
  x = funcB(x);
  x = funcC(x);

  const end = new Date().toLocaleTimeString();
  console.log(`[${workerId}] END task`, x, "at", end);

  return x;
}

async function startWorker() {

  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "tasks";

  await channel.assertQueue(queue);

  channel.prefetch(1);

  console.log(`Worker ${workerId} waiting...`);

  channel.consume(queue, async (msg) => {

    const data = JSON.parse(msg.content.toString());

    let x = data.x;

    await processTask(x);

    channel.ack(msg);

  });

}

startWorker();
