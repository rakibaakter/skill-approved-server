const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.port || 5000;

// middlewares
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://online-marketplace-e0a8e.web.app",
//     ],
//     credentials: true,
//   })
// );
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// mongodb

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bysunmk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // posted job
    const postedJobCollection = client
      .db("postedJobDB")
      .collection("postedJobs");

    app.get("/postedJob", async (req, res) => {
      let query = {};
      if (req.query?.category) {
        query = { category: req.query.category };
      }
      if (req.query?.posterEmail) {
        query = { posterEmail: req.query.posterEmail };
      }
      const result = await postedJobCollection.find(query).toArray();
      res.send(result);
    });

    // job by id
    app.get("/postedJob/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await postedJobCollection.findOne(query);
      res.send(result);
    });

    app.post("/postedJob", async (req, res) => {
      const newPostedJob = req.body;
      console.log(newPostedJob);
      const result = await postedJobCollection.insertOne(newPostedJob);
      res.send(result);
    });

    app.put("/postedJob/:id", async (req, res) => {
      const id = req.params.id;
      const updatedJob = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          posterEmail: updatedJob.posterEmail,
          title: updatedJob.title,
          deadline: updatedJob.deadline,
          categoty: updatedJob.categoty,
          maxSalary: updatedJob.maxSalary,
          minSalary: updatedJob.minSalary,
          description: updatedJob.description,
        },
      };
      const result = await postedJobCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.delete("/postedJob/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await postedJobCollection.deleteOne(query);
      res.send(result);
    });

    // bid job
    const bidCollections = client.db("postedJobDB").collection("bidRequest");

    app.get("/bid/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await bidCollections.findOne(query);
      res.send(result);
    });

    app.post("/bid", async (req, res) => {
      const bidRequest = req.body;
      console.log(bidRequest);
      const result = await bidCollections.insertOne(bidRequest);
      res.send(result);
    });

    app.get("/bid", async (req, res) => {
      let query = {};

      if (req.query?.userEmail) {
        query = { userEmail: req.query.userEmail };
      }

      if (req.query?.posterEmail) {
        query = { posterEmail: req.query.posterEmail };
      }
      const result = await bidCollections.find(query).toArray();
      res.send(result);
    });

    app.put("/bid/:id", async (req, res) => {
      const id = req.params.id;
      const updatedBid = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          title: updatedBid.title,
          userEmail: updatedBid.userEmail,
          bidDeadline: updatedBid.bidDeadline,
          bidSalary: updatedBid.bidSalary,
          status: updatedBid.status,
        },
      };
      const result = await bidCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("online marketplace server is on...");
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
