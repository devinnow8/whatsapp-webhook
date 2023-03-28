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
      console.log(visaSequence[visaSequence.indexOf(userExist.type) + 1],'visaSequence[visaSequence.indexOf(userExist.type) + 1]');
      try {
        if(msg.type === 'button_reply'){
          if(msg.data.id === 'get_Details'){
            console.log(userExist,'userrrr===>');
          }
        }
        if (msg.type === "list_reply") {
          if (userExist.type === "select_category") {
            let tempDataaa = {
              ...userExist.tmp_data,
              selected_category: msg.data.title,
              selected_category_id: msg.data.id,
            };
            let dataObjjj = {
              phone_number: msg.from,
              type:
                userExist.type !== ""
                  ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                  : visaSequence[0],
              message: "selected category",
              reply_with: "selected category",
              data: JSON.stringify(msg.data),
              tmp_data: tempDataaa,
            };
            const resss = await saveResponseData({ ...dataObjjj });
            if(resss){
              await bot.sendText(
                msg.from,
                visaSequence[visaSequence.indexOf(userExist.type) + 1]
              );
            }
          }
        }
        if (!userExist) {
          const [messageData, resObj] = generateText(visaSequence[0]);
          await bot.sendReplyButtons(msg.from, messageData, resObj);
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
        } else {
          if (userExist.type === "Welcome_Message") {
            try {
              const res = await axios.get(
                process.env.API_END_POINT + "/category-list"
              );
              const data = await res.data;
              if (data) {
                let tempDataa = { ...userExist.tmp_data };
                let dataObjj = {
                  phone_number: msg.from,
                  type:
                    userExist.type !== ""
                      ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                      : visaSequence[0],
                  message:
                    "This is a list of services we provide. Please select one from the list.",
                  reply_with: "",
                  data: JSON.stringify(msg.data),
                  tmp_data: tempDataa,
                };
                const res = await saveResponseData({ ...dataObjj });
              if(res){
                await bot.sendList(
                  msg.from,
                  "Select",
                  "This is a list of services we provide. Please select one from the list.",
                  generateText("list", data)
                );
              }
              }
            } catch (err) {
              console.log(err, "err");
            }
          }
          if (userExist.type === "Application_id") {
            let tempDataaaa = { ...userExist.tmp_data, application_id: msg.data.text };
            let dataObjjjj = {
              phone_number: msg.from,
              type:
                userExist.type !== ""
                  ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                  : visaSequence[0],
              message: msg.data.text,
              reply_with: 'dob',
              data: JSON.stringify(msg.data),
              tmp_data: tempDataaaa,
            };
            const ressss = await saveResponseData({ ...dataObjjjj });
            if(ressss){
              await bot.sendText(
                msg.from,
                visaSequence[visaSequence.indexOf(userExist.type) + 1] === "dob"
                  ? `${visaSequence[visaSequence.indexOf(userExist.type) + 1]} eg:(1996-07-21)`
                  : visaSequence[visaSequence.indexOf(userExist.type) + 1]
              );
            }
          }
          if(userExist.type === "DOB"){
            let tempDataaaaa = { ...userExist.tmp_data, dob: msg.data.text };
            let dataObjjjjj = {
              phone_number: msg.from,
              type:
                userExist.type !== ""
                  ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                  : visaSequence[0],
              message: msg.data.text,
              reply_with: 'dob',
              data: JSON.stringify(msg.data),
              tmp_data: tempDataaaaa,
            };
            const resssss = await saveResponseData({ ...dataObjjjjj });
            if(resssss){

              await bot.sendReplyButtons(
                msg.from,
                "Get Details",
                generateText('get_Details', msg.data)
              );
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
