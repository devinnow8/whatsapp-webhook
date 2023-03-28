const { createBot } = require("whatsapp-cloud-api");
const { generateText } = require("../generateText");
const axios = require("axios");
const {
  getResponseData,
  saveResponseData,
  setDbObj,
} = require("./controllers/api");
const { visaSequence } = require("./constant");

const responseBot = async (app) => {
  try {
    let userExist;
    const from = process.env.PHONE_NUMBER_ID;
    const token = process.env.TOKEN;
    const webhookVerifyToken = process.env.webhookVerifyToken;

    const bot = createBot(from, token);

    // Start express server to listen for incoming messages
    await bot.startExpressServer({
      app,
      webhookVerifyToken,
    });

    // Listen to ALL incoming messages
    console.log(userExist, "userExistuserExist==>");
    bot.on("message", async (msg) => {
      console.log(msg, "msgmsg==>");
      // userExist = await getResponseData(msg.from);
      try {
        const [messageData, resObj] = generateText(visaSequence[0]);
        await bot.sendReplyButtons(msg.from, messageData, resObj);
        userExist = await setDbObj(msg, messageData, userExist);
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = responseBot;
