const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { ObjectID } = require("mongodb");
const MongoClient = require("mongodb").MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z6ers.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();
const port = process.env.PORT || 5000;
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
  const allUserInformationCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("allUserInformation");
  const allAppliedJobCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("allAppliedJob");
  console.log("database connected");
  // perform actions on the collection object

  // post ,job by the employer
  app.post("/addJobPost", (req, res) => {
    const newPostedJob = req.body;
    console.log("adding new job: ", newPostedJob);
    allJobPostCollection.insertOne(newPostedJob).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  // get all job posted by the employer
  app.get("/employerPost", (req, res) => {
    const queryEmail = req.query.email;
    console.log("user Rents", queryEmail);
    allJobPostCollection
      .find({ email: queryEmail })
      .toArray((err, documents) => {
        console.log(documents);
        res.send(documents);
      });
  });

  // get all posted job
  app.get("/allPostedJobs", (req, res) => {
    allJobPostCollection.find({}).toArray((err, services) => {
      res.send(services);
    });
  });

  // add the signed up user role with their email
  app.post("/userInfo", (req, res) => {
    const newUserInfo = req.body;
    console.log("adding new job: ", newUserInfo);
    allUserInformationCollection.insertOne(newUserInfo).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount);
    });
  });

  // get the role of the logged in user
  app.get("/user", (req, res) => {
    const queryEmail = req.query.email;
    console.log("user Rents", queryEmail);
    allUserInformationCollection
      .find({ email: queryEmail })
      .toArray((err, documents) => {
        console.log(documents);
        res.send(documents);
      });
  });

  app.patch("/statusUpdate/:id", (req, res) => {
    console.log(req.body);
    // console.log(req.params.id);

    allAppliedJob
      .updateOne(
        { _id: ObjectID(req.params.id) },
        {
          $set: { status: req.body.jobStatus },
        }
      )
      .then((result) => {
        console.log(result);
        res.send(result.modifiedCount > 0);
      })
      .catch((err) => console.log(err));
  });

  app.post("/addToApplied", (req, res) => {
    const newAppliedJob = req.body;
    console.log("adding new job: ", newAppliedJob);
    allAppliedJobCollection.insertOne(newAppliedJob).then((result) => {
      console.log("inserted count", result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  // get the role of the logged in user
  app.get("/jobSeekerApplied", (req, res) => {
    const queryEmail = req.query.email;
    console.log("user Rents", queryEmail);
    allAppliedJobCollection
      .find({ email: queryEmail })
      .toArray((err, documents) => {
        console.log(documents);
        res.send(documents);
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
