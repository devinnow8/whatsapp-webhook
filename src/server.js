const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const responseBot = require("./index");
const keepAlive = require("./alive")
const dbConnect = require("./dbConnection");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

dbConnect();
keepAlive();

app.listen(8080, () => {
  responseBot(app);
  console.log(`app listening on port `);
});
