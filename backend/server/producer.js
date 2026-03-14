const amqp = require("amqplib");

async function sendTasks() {

  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const queue = "tasks";

  await channel.assertQueue(queue);

  for (let i = 1; i <= 6; i++) {

    channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify({ x: i }))
    );

    console.log("Sent task", i);

  }

}

sendTasks();
