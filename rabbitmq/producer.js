import amqplib from 'amqplib';

const queue = 'tasks';

// Connects to the RabbitMQ server at localhost.
const conn = await amqplib.connect("amqp://rabbitmq:5672"); // "amqp://localhost:5672"

//Creates a channel on the connection.
const ch = await conn.createChannel();

// Ensures that the queue exists or create queue
await ch.assertQueue(queue);

console.log('Worker running, waiting for messages...');

// Listens to messages from the queue.
ch.consume(queue, (msg) => {
  if (msg) {
    console.log('Hi received'); // handle message

    // acknowledges the message
    ch.ack(msg);
  }
});
