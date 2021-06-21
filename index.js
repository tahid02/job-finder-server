const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ObjectID } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z6ers.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const allJobPostCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("allJobPost");
  console.log("database connected");
  // perform actions on the collection object

  app.post("/addJobPost", (req, res) => {
    const newPostedJob = req.body;
    console.log("adding new job: ", newPostedJob);
    allJobPostCollection.insertOne(newPostedJob).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/postedJobs", (req, res) => {
    allJobPostCollection.find({}).toArray((err, services) => {
      res.send(services);
    });
  });
  //   client.close();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
