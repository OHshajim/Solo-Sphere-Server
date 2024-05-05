const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()

// middleWare 
const corsOption = {
    origin: ['http://localhost:5173'],
    Credential: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOption));
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.q9eobgc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // jobs 
        const jobsCollections = client.db('SoloSphere').collection('jobs')
        app.get('/jobs', async (req, res) => {
            const result = await jobsCollections.find().toArray();
            res.send(result);
        })
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollections.findOne(query);
            res.send(result);
        })

        // bids 
        const bidsCollections = client.db('SoloSphere').collection('bids')

        app.post('bids',async(req,res)=>{
            const bidData = req.body ;
            const result = bidsCollections.insertOne(bidData)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("server is running!!!")
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})