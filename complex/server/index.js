const keys = require("./keys");

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Client } = require("pg");
const pgClient = new Client({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

const newTableFromQuery = async () => {
  const query = `CREATE TABLE values(number INT);`;
  await pgClient.connect();
  try {
    await pgClient.query(query);
  } finally {
    // await pgClient.end();
  }
};
newTableFromQuery()
  .then(() => console.table("New table created!"))
  .catch((error) => {
    console.log("Error occured creating the table .......");
    console.error(error.stack);
  });

// pgClient.connect(function (err) {
//   if (err) {
//     console.log("Error occured during connection.............");
//     console.log(err);
//     throw err;
//   }
//   console.log("Connected!");
// });

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");

  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening");
});
