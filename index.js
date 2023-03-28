const sls = require("serverless-http");
const app = require("./src/server");
module.exports.run = sls(app);
