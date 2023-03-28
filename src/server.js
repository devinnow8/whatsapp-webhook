const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const responseBot = require("./index");
const dbConnect = require("./dbConnection");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// const httpServer = createServer(app);

dbConnect();
console.log(`app listening on port `);

app.listen(8080, () => {
  responseBot(app);
  console.log(`app listening on port `);
});

module.exports = app;
