const { createBot } = require("whatsapp-cloud-api");
const { generateText } = require("../generateText");
const axios = require("axios");
const { getResponseData, saveResponseData } = require("./controllers/api");
const { visaSequence } = require("./constant");

const responseBot = async (app) => {
  try {
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
    bot.on("message", async (msg) => {
      console.log(msg, "msgmsg==>");
      let userExist = await getResponseData(msg.from);
      try {
        if (msg.type === "list_reply") {
          if (userExist.type === "select_category") {
            let tempData = {
              ...userExist.tmp_data,
              selected_category: msg.data.title,
              selected_category_id: msg.data.id,
            };
            console.log(userExist, "userExistuserExist==> 333");
            let dataObj = {
              phone_number: msg.from,
              type:
                userExist.type !== ""
                  ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                  : visaSequence[0],
              message: "selected category",
              reply_with: "selected category",
              data: JSON.stringify(msg.data),
              tmp_data: tempData,
            };
            const res = await saveResponseData({ ...dataObj });
            console.log(res, "resresres save db ==> 333");
          }
        }
        if (!userExist) {
          const [messageData, resObj] = generateText(visaSequence[0]);
          await bot.sendReplyButtons(msg.from, messageData, resObj);
          console.log(userExist, "userExistuserExist==> 111");
          let tempData = { ...userExist.tmp_data };
          let dataObj = {
            phone_number: msg.from,
            type:
              userExist.type !== ""
                ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                : visaSequence[0],
            message: msg.data.text,
            reply_with: messageData,
            data: JSON.stringify(msg.data),
            tmp_data: tempData,
          };
          const res = await saveResponseData({ ...dataObj });
          console.log(res, "resresres save db ==> 111");
        } else {
          if (userExist.type === "Welcome_Message") {
            try {
              const res = await axios.get(
                process.env.API_END_POINT + "/category-list"
              );
              const data = await res.data;
              if (data) {
                await bot.sendList(
                  msg.from,
                  "Select",
                  "This is a list of services we provide. Please select one from the list.",
                  generateText("list", data)
                );
                console.log(userExist, "userExistuserExist==> 222");
                let tempData = { ...userExist.tmp_data };
                let dataObj = {
                  phone_number: msg.from,
                  type:
                    userExist.type !== ""
                      ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                      : visaSequence[0],
                  message:
                    "This is a list of services we provide. Please select one from the list.",
                  reply_with: "",
                  data: JSON.stringify(msg.data),
                  tmp_data: tempData,
                };
                const res = await saveResponseData({ ...dataObj });
                console.log(res, "resresres save db ==> 222");
              }
            } catch (err) {
              console.log(err, "err");
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = responseBot;
