const path = require("path"); 
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const serverless = require("serverless-http");
const cookieParser = require("cookie-parser");
const { MongoClient, ObjectId } =  require("mongodb");
const fs  = require("fs");
require("dotenv").config();

const app = express();
const router = express.Router();
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname , "../../public")));


const MONGO_URI = process.env.CONNECTIONSTRING ;


let cachedClient = null ;
let cachedDb = null ;

function createTokens(user) {
    const accessToken = jwt.sign(
        {id: user.id, username: user.username},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "15m"}
    );

    const refreshToken = jwt.sign(
        {id: user.id , username: user.username },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: "14d"}
    )

    console.log("tokens created")
    return {refreshToken, accessToken}

}

const newAccessToken = (refreshToken) => {
    console.log("creating new accesstoken");

    if (!refreshToken) {
        return { message: "No refresh token, Log in again", status: "failed" };
    }

    try {
        console.log("refresh token found checking if valid");

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { id: userId, username } = decoded;

        console.log("refresh token valid, creating new access token");

        const accessToken = jwt.sign(
        { id: userId, username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
        );

        return {
        userId,
        username,
        accessToken,
        status: "success",
        message: "New access token created"
        };
    } catch (err) {
        return { message: "Invalid or expired refresh token", status: "failed" };
    }
};

const verifyAccessToken = (token) => {
    console.log("verifying access token");

    let userId ;
    let username;
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        userId = decoded.id;
        username = decoded.username;
    } catch (err) {
        return {message: "Couldn't verify accessToken", status: "failed" }
    }

    return {userId, username, message: "Access Token verified", status: "success"}

}



const verifyToken = async(accesstoken, refreshtoken) => {

    console.log("verifying access token");


    try {
        const decoded = jwt.verify(accesstoken, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const username = decoded.username;

        return {
            accessToken: accesstoken,
            userId, 
            username, 
            message: "Access Token verified", 
            validated: true}
    } catch (err) {
        console.error(err.message) ;
        console.log("Couldn't verify accessToken");
        console.log("creating new accesstoken");

        if (!refreshtoken) {
            return { message: "No refresh token, Log in again", validated: false };
        }

        try {
            console.log("refresh token found checking if valid");

            const decoded = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
            const { id: userId, username } = decoded;
            const validInDb = await checkDbRefreshToken(userId , refreshtoken) ;
            console.log("Db refresh token valid:", validInDb) ;
            if (!validInDb) {
                
                return { message: "Refresh token not recognized, log in again", validated: false };
            }

            console.log("refresh token valid, creating new access token");

            const accessToken = jwt.sign(
            { id: userId, username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
            );

            return {
            userId,
            username,
            accessToken,
            validated: true,
            message: "New access token created"
            };
        } catch (err) {
            console.error(err.message) ;
            return { message: "Invalid or expired refresh token", validated: false };
        }
    }


}


async function connectToDatabase() {
    if (cachedClient && cachedDb ) {
        return { client : cachedClient , db : cachedDb };

    }
    if (!MONGO_URI) { 
        throw new Error ("Missing CONNECTION env var") ;
    }
    const client =  new MongoClient(MONGO_URI);

    try {
        const connect = await client.connect(); 
        if (connect) console.log("connected to Database");
        const db = client.db("Note") ;
        cachedClient = client ;
        cachedDb = db ;
        return { client: cachedClient , db: cachedDb} ;
    } catch (err) {
        console.error(`error: ${err.message} ; Could not connect to mongoDb `)
        return;
    }
    
}

const checkDbRefreshToken = async(id , refreshtoken) => { 
    console.log("checking Db for refreshToken") ;
    const {db} = await connectToDatabase() ;
    const user = db.collection("Users");
    const oid = ObjectId.createFromHexString(id);
    console.log("checking for user id:", oid) ;

    const foundUser = await user.findOne({ _id: oid });
    console.log("found user:", foundUser.username) ;
    if (foundUser.refreshToken === refreshtoken) {
        console.log(" token found in database");
        return true;
    } else {
        console.log(" token NOT found in database");
        return false;
    }
}

router.get(["/notebook", "/note"] , async(req , res) => {
    res.sendFile(path.join(__dirname, "../../public/index.html"))

}) 

router.post("/register", async (req , res) => {

    const {username, email, password} = req.body;

    try {
        const salt = await bcrypt.genSalt();
        const hashedpassword = await bcrypt.hash(password, salt);
        
        const newUser = {username, email, hashedpassword};

        const {db} = await connectToDatabase();
        const users = db.collection("Users");

        const response = await users.insertOne({username, email, hashedpassword});

        const userId = response.insertedId.toString();
        const userObject = {id: userId, username: username } ;

        const { accessToken , refreshToken } = createTokens(userObject);
        const updated = await users.updateOne(
            {username: username } , {$set: {refreshToken}} 
        ) ;

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, maxAge: 14 * 24 * 60 * 60 * 1000
        });

        res.cookie("has_auth", "true", {
            httpOnly: false, maxAge: 14 * 24 * 60 * 60 * 1000
        });

        res.status(201).json( 
           {status: true, message :"user profile created", username, accessToken}
        );
    } catch (err) {
        console.error("Error in registration", err.message) ;
        res.status(500).json({error : "Registration failed"})
    }
    

})

router.post("/login" , async (req , res) => {
    const {username , password} = req.body ;

    const {db} = await connectToDatabase();
    const users = db.collection("Users") ;
    const user = await users.findOne({username: username}) ;
    
    if (user===null) {
        res.status(200).json({status: false, message :"Username not found. create an account"});
        return;
    } else {
        try {
            const confirm = await bcrypt.compare(password, user.hashedpassword);
            if (confirm) {
                const userId = user._id.toString();
                const userObject = {id: userId, username} ;
                
                const { accessToken , refreshToken } = createTokens(userObject);
                const updated = await users.updateOne(
                    {username: username } , {$set: {refreshToken}} 
                ) ;

                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true, maxAge: 14 * 24 * 60 * 60 * 1000
                });

                res.cookie("has_auth", "true", {
                    httpOnly: false, maxAge: 14 * 24 * 60 * 60 * 1000
                });
                
                res.status(200).json({status: true, message :"Correct password", username});

            } else {
                
                console.log(confirm, "incorrect password");
                res.status(200).json({status: false, message :"incorrect password"});
                return;

            }
        } catch (err) {
            console.error("Bcrypt compare failed:", err.message);
            res.status(500).json({error: "Something went wrong, please try again later."});
        }
        
    }
    

})

router.post("/checkUsername" , async (req , res) => {
    console.log("trigered");
    const username = req.body.uName;
    const inputt = req.body.input;
    console.log(inputt);
    
    try {
        
        const {db} = await connectToDatabase() ;
        const user = db.collection("Users");
        let confirm;
        if (inputt === "username") {
            confirm =await user.findOne({username: username}) ;
        } else {
            confirm =await user.findOne({email: username}) ;
        }    
        const response = (confirm===null)? "available" : "unavailable" ;
        res.status(200).send(response);

        console.log(confirm,username,response)

    } catch (err) {
           console.error("there was an error")
    }
    

})

router.post("/getNotes", async (req, res) => {
    let accessToken = req.body.ACCESSTOKEN;
    const refreshToken = req.cookies.refreshToken;
    

    let userId;
    let USER;

    const validateUser = await verifyToken(accessToken,refreshToken) ;
    
    if (validateUser.validated) {
        accessToken = validateUser.accessToken;
        userId = validateUser.userId;
        USER = validateUser.username;

    } else if (!validateUser.validated) {
        console.log(validateUser.message)
        res.status(403).json(validateUser);
        return;
    }
  

    try {
        const { db } = await connectToDatabase();
        console.log("getting notes");
        const notes = await db
        .collection("NoteCollection")
        .find({ userId: userId }) 
        .toArray();

        if (notes.length === 0) {
        return res.status(404).json({ accessToken, USER, validated: true, notes:"none", message: "No notes found" });
        }

        res.json({accessToken, USER, notes});
    } catch (err) {
        console.error(err);
        res.status(500).json({ validated: true , status: "failed" , message: "Server error" });
    }
});

router.post("/delNote" , async (req , res) => {
    const id = req.body.id;
    let accessToken = req.body.ACCESSTOKEN;
    const refreshToken = req.cookies.refreshToken;

    let userId;
    let USER;

    const validateUser = await verifyToken(accessToken,refreshToken) ;
    if (validateUser.validated) {
        accessToken = validateUser.accessToken;
        userId = validateUser.userId;
        USER = validateUser.username;

        console.log(validateUser.message);
    } else if (!validateUser.validated) {
        console.log(validateUser.message)
        res.status(403).json(validateUser);
        return;
    }

    try { 
        const { db } = await connectToDatabase();
        const find = await db.collection("NoteCollection").findOne({id : id});
        if (find.userId===userId) {
            const del = await db.collection("NoteCollection").deleteOne({id : id});
            if (del) {
                res.status(200).json(accessToken);
                console.log(`Note ${id} has been deleted `) ;

            } else {
                res.status(404);
                console.log("failed to delete");
            }
        } else {
            res.status(403).json({message: "you do not have permission to delete."});
        }
        
    } catch (err) {
        console.error(err);
        res.status(500);
    }
})

router.post("/editNote" , async (req , res) => {
    const {nId, id, title, content, createTime} =  req.body;

    let accessToken = req.body.ACCESSTOKEN;
    const refreshToken = req.cookies.refreshToken;

    let userId;
    let USER;

    const validateUser = await verifyToken(accessToken,refreshToken) ;
    if (validateUser.validated) {
        accessToken = validateUser.accessToken;
        userId = validateUser.userId;
        USER = validateUser.username;

        console.log(validateUser.message);
    } else if (!validateUser.validated) {
        console.log(validateUser.message)
        res.status(403).json(validateUser);
        return;
    }

    try {
        const { db } = await connectToDatabase();
        const newNote = {userId, id , title, content , createTime };
        
        const find = await db.collection("NoteCollection").findOne({id : id});
        if (find.userId===userId) {
            const update = db.collection("NoteCollection")
                .updateOne({id : id } , {$set: { id , title, content , createTime } });
            if (update) {
                res.status(200).json(accessToken);
                console.log(`note ${id} updated`) ;
            } else {
                res.status(404);
                console.log('Note not found or cant be deleted')
            }
        } else {
             res.status(403).json({message: "you do not have permission to edit."});
        }
    } catch (err) {
        console.log(err);
        res.status(500);

    }
})

router.post("/newNote" , async (req , res) => {
    const {ACCESSTOKEN, title , content , createTime } = req.body ;
    let accessToken = ACCESSTOKEN;
    let userId;

    const checkToken = verifyAccessToken(accessToken);
    if (checkToken.status==="success") {
        userId = checkToken.userId;
    } else {

        const refreshToken = req.cookies.refreshToken;
        const newToken = newAccessToken(refreshToken) ;
        if (newToken.status==="success") {
            accessToken = newToken.accessToken ;
            userId = newToken.userId;
        } else {
            console.log(newToken);
            res.status(403).json(newToken);
            return;
        }

    }

    try { 
        const { db } = await connectToDatabase();
        const Collection = db.collection("NoteCollection");

        const lastNote = await Collection.findOne({} , {sort :{ id : -1}}) ;
        const id = lastNote.id + 1;
        const newNote = {userId, id , title , content, createTime} ;
        const insertNote = await Collection.insertOne({userId, id , title , content , createTime});

        if (insertNote.acknowledged) {
            res.status(201).json({accessToken, id});

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

router.post("/logout", async (req, res) => { 

    let accessToken = req.body.ACCESSTOKEN;
    const refreshToken = req.cookies.refreshToken;
    
    const validateUser = await verifyToken(accessToken,refreshToken) ;
    if (!validateUser.validated) {
        console.log(validateUser.message)
        res.status(403).json(validateUser);
        return;
    }

    try {

        const {db} = await connectToDatabase() ;
        const users = db.collection("Users");
        const oid = ObjectId.createFromHexString(validateUser.userId);
        console.log("clearing refresh token for user id:", oid) ;

        const updated = await users.updateOne(
            { _id: oid } , {$set: {refreshToken: null}} 
        ) ;
        console.log("refresh token cleared in database") ;

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
        return
    }

    res.clearCookie("refreshToken");
    res.clearCookie("has_auth");
    res.status(200).json({ message: "Logged out successfully" });


});

app.use("/.netlify/functions/app", router);
module.exports.handler = serverless(app);