import amqplib from 'amqplib';

const queue = 'tasks';

let ch, conn;

// small helper to pause execution
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const connectRabbitmq = async () => {
    // keep trying until connection succeeds
    while (true) {
        try {
            // connect to RabbitMQ server
            const conn = await amqplib.connect("amqp://rabbitmq:5672");

            // create a channel on the connection
            ch = await conn.createChannel();

            // ensure the queue exists
            await ch.assertQueue(queue);

            console.log("Rabbitmq connection established");

            break; // exit loop once connected
        } catch (err) {
            console.log("error connecting Rabbitmq, retrying in 2s");

            // wait 2 seconds before retry
            await sleep(2000);
        }
    }
};

export const sendEmail = () => {

    ch.sendToQueue(queue, Buffer.from('Hi'));
    console.log('Hi sent');
};
