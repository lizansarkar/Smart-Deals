const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://smartdb:jtKVXz6E1O5DOJPY@lizan0.tl45evy.mongodb.net/?appName=lizan0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();

    app.post("/", (req, res) => {
      res.send("my smart server is running...");
    });
    const db = client.db("smart-db");
    const productsCollection = db.collection("products");


    app.get('/products', async (req, res) => {
        const cursor = productsCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productsCollection.findOne(query)

        res.send(result)
    })

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });

    app.patch('/products/:id', async (req, res) => {
        const id = req.params.id;
        const updatedProduct = req.body;
        const query = { _id: new ObjectId(id)}

        const update = {
            $set: {
                name: updatedProduct.name,
                price: updatedProduct.price
            }
        }

        const result = await productsCollection.updateOne(query, update)

        res.send(result)
    })

    app.delete('/products/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await productsCollection.deleteOne(query)
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.connect();
  }
};

run().catch(console.dir);

app.listen(port, () => {
  console.log(`my smart server runnign port NO ${port}`);
});

//jtKVXz6E1O5DOJPY
