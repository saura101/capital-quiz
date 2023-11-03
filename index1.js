import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client ({
    user : "postgres",
    host : "localhost",
    database : "world",
    password : "mamaman2020",
    port : 5432
});

db.connect();

let quiz = [
    { country : "France", capital : "Paris"},
    { country : "United states of America", capital : "Washington DC"},
    { country : "United Kingdom", capital : "london" }
];

db.query("SELECT * FROM capitals",(err,res) => {
    if(err) {
        console.error("Error executing query",err.stack);
    } else {
        quiz = res.rows;
        //console.log(res.rows);
    }
    db.end();
});

let totalCorrect = 0;

//middleware
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static("public"));

let currentQuestion = {};

//GET home page
app.get("/",(req,res) => {
    totalCorrect = 0;
    nextQuestion();
    res.render("index1.ejs", {   question : currentQuestion });
});

//POST submit a question
app.post("/submit",(req,res) => {
    let answer = req.body.answer.trim(); //trim function trims the spaces before and after
    let isCorrect = false;
    if(currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
        totalCorrect++;
        console.log(totalCorrect);
        isCorrect = true;
    }

    nextQuestion();
    res.render("index1.ejs", {
        question : currentQuestion,
        wasCorrect : isCorrect,
        totalScore : totalCorrect
    });
});

function nextQuestion() {
    const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

    currentQuestion = randomCountry;
    console.log(currentQuestion);
}

app.listen(port,()=> {
    console.log(`server running on port ${port}`);
});