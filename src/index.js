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
      console.log(
        visaSequence[visaSequence.indexOf(userExist.type) + 1],
        "visaSequence[visaSequence.indexOf(userExist.type) + 1]"
      );
      try {
        if (msg.type === "button_reply") {
          if (msg.data.id === "get_Details") {
            const { selected_category, application_id } = userExist.tmp_data;
            console.log(userExist, "userrrr===>");
            try {
              const detailRes = await axios.post(
                process.env.API_END_POINT + "/application-detail",
                {
                  applicationId: application_id,
                  dob: userExist.tmp_data.dob,
                  serviceType: selected_category,
                }
              );
              const data = await detailRes.data;
              const {
                appointmentId,
                appointmentDate,
                appointmentTime,
                applicantFullName,
                status,
                price,
                currency,
                phone_number,
                email,
                applicationId,
                name,
                country,
                category,
                dob,
                service_type,
              } = data;
              if (!appointmentId) {
                const newObj = {
                  applicationId,
                  name,
                  country,
                  category,
                  dob,
                  email,
                  phone_number,
                  service_type,
                };
                let msgs = "";
                Object.keys(newObj).forEach((item) => {
                  msgs = `${item}: ${newObj[item]}`;
                });
                setTimeout(() => {
                  // bot.sendText(msg.from, msgs);
                  bot.sendReplyButtons(
                    msg.from,
                    msgs,
                    generateText("get_center", msg.data)
                  );
                }, 700);
              } else {
                // booked work
              }
            } catch (err) {
              console.log(err);
            }
          }
          if (msg.data.id === "get_center") {
            try {
              const res = await axios.get(
                process.env.API_END_POINT + "/center-list"
              );
              const data = await res.data;
              if (data) {
                await bot.sendList(
                  msg.from,
                  "Select",
                  "This is a list of centers. Please select one from the list.",
                  generateText("center_list", data)
                );
              }
            } catch (err) {
              console.log(err);
            }
          }
          if (msg.data.id === "get_DateAndTime") {
            try {
              const detailRes = await axios.get(
                process.env.API_END_POINT +
                  `/center/${userExist.tmp_data.center_id}/appointment-slot`
              );
              console.log(detailRes, "detailResdetailRes==>>>");
              const data = await detailRes.data;
              const filterdData =
                data && data.filter((item) => item.type === "date");
              if (filterdData) {
                await bot.sendList(
                  msg.from,
                  "Select",
                  "This is a list of Date and time. Please select one from the list.",
                  generateText("list_date", filterdData)
                );
              }
            } catch (err) {
              console.log(err);
            }
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
            if (resss) {
              await bot.sendText(
                msg.from,
                visaSequence[visaSequence.indexOf(userExist.type) + 1]
              );
            }
          }
          if (userExist.type === "Center") {
            let tmpData = {
              ...userExist.tmp_data,
              center_id: msg.data.id,
              center_name: msg.data.title,
            };
            let objData = {
              phone_number: msg.from,
              type:
                userExist.type !== ""
                  ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                  : visaSequence[0],
              message: msg.data.text,
              reply_with: messageData,
              data: JSON.stringify(msg.data),
              tmp_data: tmpData,
            };
            const response = await saveResponseData({ ...objData });
            console.log(response, "responseresponse==>");
            if (response) {
              await bot.sendReplyButtons(
                msg.from,
                "Please choose the available slot 10 slots (date time) and more button",
                generateText("get_DateAndTime", msg.data)
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
                if (res) {
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
            let tempDataaaa = {
              ...userExist.tmp_data,
              application_id: msg.data.text,
            };
            let dataObjjjj = {
              phone_number: msg.from,
              type:
                userExist.type !== ""
                  ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                  : visaSequence[0],
              message: msg.data.text,
              reply_with: "dob",
              data: JSON.stringify(msg.data),
              tmp_data: tempDataaaa,
            };
            const ressss = await saveResponseData({ ...dataObjjjj });
            if (ressss) {
              await bot.sendText(
                msg.from,
                visaSequence[visaSequence.indexOf(userExist.type) + 1] === "DOB"
                  ? `${
                      visaSequence[visaSequence.indexOf(userExist.type) + 1]
                    } eg:(1996-07-21)`
                  : visaSequence[visaSequence.indexOf(userExist.type) + 1]
              );
            }
          }
          if (userExist.type === "DOB") {
            let tempDataaaaa = { ...userExist.tmp_data, dob: msg.data.text };
            let dataObjjjjj = {
              phone_number: msg.from,
              type:
                userExist.type !== ""
                  ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                  : visaSequence[0],
              message: msg.data.text,
              reply_with: "dob",
              data: JSON.stringify(msg.data),
              tmp_data: tempDataaaaa,
            };
            const resssss = await saveResponseData({ ...dataObjjjjj });
            if (resssss) {
              await bot.sendReplyButtons(
                msg.from,
                "Get Details",
                generateText("get_Details", msg.data)
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
