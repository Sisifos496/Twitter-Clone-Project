import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDocs, addDoc } from "firebase/firestore"
import { getAuth, onAuthStateChanged ,createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import dotenv from 'dotenv';
dotenv.config();

const app = express()
app.use(cors());
app.use(bodyParser.json())
app.use(cookieParser())

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp)

app.get("/api/logout", async(req, res) => {
    let signingOut = await auth.signOut()
})

app.get("/api/read-tweets", async (req, res) => {
    let colRef = collection (db, "tweets")
    let querySnapshot = await getDocs(colRef);
        let tweets = [];
        querySnapshot.docs.forEach(doc => {
            tweets.push({ ...doc.data() })
        });

    res.status(200).send(tweets)
    console.log(tweets)
})

app.post("/api/write-tweets", async (req, res) => {
    let colRef = collection (db, "tweets")
    let sendTweet = await addDoc(colRef, {
        like: 0,
        liked_by: [],
        replies: [],
        text: req.body.text,
        user: ((auth.currentUser.email).split("@"))[0]
    });
    
    res.status(200).send("Tweet successfully sent")
})

app.post('/api/sign-up', async (req, res) => {
    try {
        
        await createUserWithEmailAndPassword(auth, req.body.email, req.body.password);
        await signInWithEmailAndPassword(auth, req.body.email, req.body.password);

        res.status(200).send("New User is Added Successfully")

    } catch (error) {

        res.status(400).send(`New User isn't Added Successfully ${error.message}`)
        console.log(error.message)

    }
})

app.post('/api/login', async (req, res) => {
    try {
        await signInWithEmailAndPassword(auth, req.body.email, req.body.password);

        res.status(200).send("User is Logged in Successfully")

    } catch (error) {

        res.status(400).send(`New User isn't Logged in Successfully ${error.message}`)
        console.log(error.message)

    }
})

app.get("/api/check-session", async (req, res) => {
    try {
        const userPromise = new Promise((resolve, reject) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    
                    resolve(user);
                } else {
                    reject(new Error("User is not logged in"));
                }
            });
        });

        const user = await userPromise;
        res.status(200).send({ message: "User is logged in", user: user.email });
    } catch (error) {
        console.log(error);
        res.status(401).send({ message: "User is not logged in" });
    }
});



app.listen(8080, () => {
    console.log("App Listens on Port 8080")
})

