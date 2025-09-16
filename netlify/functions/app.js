const path = require("path"); 
const express = require("express");
const serverless = require("serverless-http");
const { MongoClient } =  require("mongodb");
require("dotenv").config();

const app = express();
const router = express.Router();
app.use(express.json());

app.use(express.static(path.join(__dirname , "../../public")));

console.log("test");

//const client = new MongoClient(process.env.CONNECTIONSTRING) ;
const MONGO_URI = process.env.CONNECTIONSTRING ;
//let cachedClient = null ;
//let cachedDb = null ;

//const db = client.db("Note");
//const Collection = db.collection('NoteCollection'); 

/*const connectToDatabase = async () => {
    if (cachedClient && cachedDb ) {
        console.log("Already connected to database") ;
        return {client: cachedClient , db: cachedDb}
    }
    if (!MONGO_URI) { 
        throw new Error ("Missing CONNECTION env var") ;
    }
    const client  = new MongoClient(MONGO_URI) ;
    const connect  = await client.connect(); 
    console.log("Connected to mongoDb");


}


router.get("/getNotes" , async (req , res) => {
    
    console.log("This function works");
    const connect  = await client.connect(); 
     console.log("Connected to mongoDb");

    if (connect) { 
        console.log("connected");
          const notes = await Collection.find().toArray();
          res.json(notes);
          console.log(notes);
    }

    else {res.json([])} 
});

*/


let cachedClient = null ;
let cachedDb = null ;

async function connectToDatabase() {
    if (cachedClient && cachedDb ) {
        return { client : cachedClient , db : cachedDb };
    }
    if (!MONGO_URI) { 
        throw new Error ("Missing CONNECTION env var") ;
    }
    const client =  new MongoClient(MONGO_URI);

    const connect = await client.connect(); 
    if (connect) console.log("connected to Database");
    const db = client.db("Note") ;
    cachedClient = client ;
    cachedDb = db ;
    return { client: cachedClient , db: cachedDb} ;
}

router.get(["/notebook", "/note"] , async(req , res) => {
    res.sendFile(path.join(__dirname, "../../public/index.html"))

}) 

router.get("/getNotes" , async (req , res) => {
    try {
         const { db } = await connectToDatabase() ;
         const notes  = await db.collection("NoteCollection").find().toArray();   
         res.json(notes);
         } catch (err) {
            console.error(err);
            res.status(500).json([]);
         }
});

router.post("/delNote" , async (req , res) => {
    try { 
        const id = req.body.id;
        const { db } = await connectToDatabase();
        const del = await db.collection("NoteCollection").deleteOne({id : id});
        console.log(del);

        if (del) {
            res.status(200).json([]);
            console.log(`Note ${id} has been deleted `) ;

        } else {
            res.status(404);
            console.log("failed to delete");
        }
        
    } catch (err) {
        console.error(err);
        res.status(500);
    }
})

router.post("/editNote" , async (req , res) => {
    try {
        const {nId, id, title, content, createTime} =  req.body;
        const { db } = await connectToDatabase();
        const newNote = { id: nId , title, content , createTime };
        const update = db.collection("NoteCollection")
            .updateOne({id : id } , {$set: { id: nId , title, content , createTime } });
        if (update) {
            res.status(200).json([]);
            console.log(newNote) ;
        } else {
            res.status(404);
            console.log('Note not found or cant be deleted')
        }
    } catch (err) {
        console.log(err);
        res.status(500);

    }
})

router.post("/newNote" , async (req , res) => {
    try {
        const { title , content , createTime } = req.body ;
        const { db } = await connectToDatabase();
        const Collection = db.collection("NoteCollection");

        const lastNote = await Collection.findOne({} , {sort :{ id : -1}}) ;
        console.log(lastNote);
        const id = lastNote.id + 1;
        console.log(id) ;
        const newNote = {id , title , content, createTime} ;
        const insertNote = await Collection.insertOne({ id , title , content , createTime});
        if (insertNote.acknowledged) {
            res.status(201).json([]);
            console.log(newNote) ;

        } else {
             res.status(404);
             console.log("Failed to save note") ;
        }
    } catch (err) {
        res.status(500);
        console.error(err);
        console.log("server Error") ;
    }


    
}); 
app.use("/.netlify/functions/app", router);
module.exports.handler = serverless(app);