const mqtt = require('mqtt');
const url = "mqtts://mqtt.cloud.hanzenet.com";

let latestData;

const credentials = {
  username: "duurzamewijken",
  password: "zt2hc5c7e97ttre"
}

const client = mqtt.connect(url, credentials);

client.on("connect", () => {
  console.log('Connected to the broker');
  // Subscribe to the desired topic
  client.subscribe('app/hanzebox/data/C049EFA1F07C4nh17dv/#', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Receiving live data');
    }
  });
});

client.on("message", (topic, message) => {
  // message is a Buffer
  latestData = message.toString();
  console.log(latestData);
});

client.on("error", (error) => {
  console.error('MQTT Client Error:', error);
});

client.on("close", () => {
  console.log('Connection closed');
});

const getLatestData = (req, res) => {
  res
    .status(200)
    .json(latestData);
}

module.exports = {
  getLatestData,
}