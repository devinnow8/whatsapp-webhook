const { createBot } = require("whatsapp-cloud-api");
const { generateText } = require("../generateText");
const axios = require("axios");
const { getResponseData, saveResponseData } = require("./controllers/api");

const responseSequence = ["start", "greeting", "servicesList"];
const visaSequence = ["start", "application_Id", "dob", "end"];
const generalSequence = [
  "name",
  "nationality",
  "id_type",
  "id_number",
  "email",
  "phone_no",
  "end",
];
const responseBot = async (app) => {
  const diff_hours = (dt2, dt1) => {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    console.log(diff, "diffdiff==>");
    diff /= 60 * 60;
    console.log(Math.round(diff), "Math.round(diff)==>");
    return Math.abs(Math.round(diff));
  };
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
      try {
        let userExist = await getResponseData(msg.from);
        if (userExist) {
          if (msg.type === "button_reply") {
            if (userExist.next_response_type === "serviceList") {
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
                }
              } catch (err) {
                console.log(err, "err");
              }
            }
            if (msg.data.id === "book_appointment") {
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
                  let dataObjcenter = {
                    current_user: msg.from,
                    bot_response: userExist.next_response_type,
                    response_type: userExist.next_response_type,
                    next_response_type: "select_center",
                    user_response: msg.data.text || JSON.stringify(msg.data),
                    selected_category: userExist.selected_category,
                  };
                  const res = await saveResponseData({ ...dataObjcenter });
                }
              } catch (err) {
                console.log(err, "err");
              }
            }
            if (msg.data.id === "selected_date") {
              try {
                let dataObjcenter = {
                  current_user: msg.from,
                  bot_response: userExist.next_response_type,
                  response_type: userExist.next_response_type,
                  next_response_type: "complated",
                  user_response: msg.data.text || JSON.stringify(msg.data),
                  selected_category: userExist.selected_category,
                  center_id: userExist.center_id,
                  selected_date: userExist.selected_date,
                  selected_time: userExist.selected_time,
                  selected_day: userExist.selected_day,
                };
                let apiObj = [
                  {
                    application_id: userExist.appointmentId,
                    appointment_date: userExist.selected_date,
                    appointment_time: userExist.selected_time,
                    appointment_day: userExist.selected_day,
                    applicant_fullname: userExist.name,
                    category: userExist.selected_category,
                    country: userExist.country,
                    service_type: userExist.service_type,
                    id_number: userExist.id_number,
                    currency: userExist.currency,
                    id_type: userExist.id_type,
                    dob: userExist.dob,
                    email: userExist.email,
                    phone_number: userExist.phone,
                    price: userExist.price,
                  },
                ];
                console.log(userExist, "dataObjcenter==>", dataObjcenter);
                const detailRes = await axios.post(
                  process.env.API_END_POINT +
                    `center/${userExist.center_id}/appointment`,
                  {
                    apiObj,
                  }
                );

                console.log(detailRes, "datadatadata===--->");
                const data = await detailRes.data;
                // const res = await saveResponseData({ ...dataObjcenter });
              } catch (err) {
                console.log(err);
              }
            }
          }
          if (msg.type === "list_reply") {
            if (userExist.next_response_type === "Appointment_book") {
              let dateAndTime = msg.data.title.split(" ");
              let dataObjcenter = {
                current_user: msg.from,
                bot_response: userExist.next_response_type,
                response_type: userExist.next_response_type,
                next_response_type: "call_order",
                user_response: msg.data.text || JSON.stringify(msg.data),
                selected_category: userExist.selected_category,
                center_id: msg.data.id,
                selected_date: dateAndTime[0],
                selected_time: dateAndTime[1] + " " + dateAndTime[2],
              };
              // console.log(msg, "msg.datamsg.data==>", userExist);
              const res = await saveResponseData({ ...dataObjcenter });
              try {
                await bot.sendReplyButtons(
                  msg.from,
                  `you selected ${dateAndTime[0]} ${dateAndTime[1]} ${dateAndTime[2]}`,
                  generateText("selected_date", msg.data)
                );
                const res = await saveResponseData({ ...data });
              } catch (err) {
                console.log(err);
              }
            }
            if (userExist.next_response_type === "select_center") {
              let dataObjcenter = {
                current_user: msg.from,
                bot_response: userExist.next_response_type,
                response_type: userExist.next_response_type,
                next_response_type: "select_date",
                user_response: msg.data.text || JSON.stringify(msg.data),
                selected_category: userExist.selected_category,
                selected_center: msg.data.title,
                center_id: msg.data.id,
              };
              // console.log(msg, "msg.datamsg.data==>", userExist);
              const res = await saveResponseData({ ...dataObjcenter });
              try {
                await bot.sendReplyButtons(
                  msg.from,
                  "select date and time",
                  generateText("select_date", msg.data)
                );
                const res = await saveResponseData({ ...data });
              } catch (err) {
                console.log(err);
              }
            } else {
              let data = {
                current_user: msg.from,
                user_response:
                  "This is a list of services we provide. Please select one from the list",
                bot_response: msg.data.title,
                response_type: "",
                next_response_type:
                  msg.data.title === "visa"
                    ? visaSequence[0]
                    : generalSequence[0],
                selected_category: msg.data.title,
              };
              try {
                await bot.sendReplyButtons(
                  msg.from,
                  "Choose further action here",
                  generateText(msg.type, msg.data)
                );
                const res = await saveResponseData({ ...data });
              } catch (err) {
                console.log(err);
              }
            }
          }
          if (userExist.selected_category === "visa") {
            if (userExist.next_response_type === "end") {
              try {
                try {
                  const detailRes = await axios.post(
                    process.env.API_END_POINT + "/application-detail",
                    {
                      applicationId: userExist.dob,
                      dob: userExist.user_response,
                      serviceType: userExist.selected_category,
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
                  let dataDb = {
                    ...data,
                    current_user: msg.from,
                    response_type: "application details",
                    next_response_type: appointmentId
                      ? "go_back"
                      : "book_appointment",
                    user_response: "save data",
                    bot_response: "save data",
                  };
                  const res = await saveResponseData({ ...dataDb });

                  if (appointmentId) {
                    const newObj = {
                      appointmentId,
                      appointmentDate,
                      appointmentTime,
                      applicantFullName,
                      status,
                      price,
                      currency,
                      phone_number,
                      email,
                    };
                    bot.sendText(
                      msg.from,
                      "An appointment has been already booked with your appointment Id. Check for Details Below."
                    );
                    setTimeout(() => {
                      Object.keys(newObj).forEach((item) => {
                        bot.sendText(msg.from, `${item}: ${newObj[item]}`);
                      });
                    }, 700);

                    setTimeout(() => {
                      bot.sendReplyButtons(
                        msg.from,
                        "Confirm",
                        generateText("confirm", {})
                      );
                    }, 1000);
                    let dbData = {
                      current_user: msg.from,
                      response_type: "application details",
                      next_response_type: visaSequence[0],
                      user_response: "Please provide another application Id",
                      bot_response: JSON.stringify(msg.data),
                      selected_category: userExist.selected_category,
                      appointmentId: "",
                      appointmentDate: "",
                      appointmentTime: "",
                      applicantFullName: "",
                    };
                    const res = await saveResponseData({ ...dbData });
                  } else {
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
                    bot.sendText(msg.from, "Appointment Details Below.");
                    setTimeout(() => {
                      Object.keys(newObj).forEach((item) => {
                        bot.sendText(msg.from, `${item}: ${newObj[item]}`);
                      });
                    }, 700);
                    setTimeout(() => {
                      bot.sendReplyButtons(
                        msg.from,
                        "Book appointment",
                        generateText("book_appointment", {})
                      );
                    }, 1000);
                  }
                } catch (err) {
                  console.log(err, "err ==>");
                }
              } catch (err) {
                console.log(err, "err==>");
              }
            } else {
              if (
                userExist.next_response_type !== "book_appointment" &&
                userExist.next_response_type !== "select_center"
              ) {
                const nextMessage =
                  userExist.next_response_type === "start"
                    ? visaSequence[1]
                    : visaSequence[
                        visaSequence.indexOf(userExist.next_response_type) + 1
                      ];
                if (nextMessage == "end") {
                  await bot.sendReplyButtons(
                    msg.from,
                    "getApplicatonDetail",
                    generateText("get_Details", {})
                  );
                } else {
                  await bot.sendText(
                    msg.from,
                    nextMessage === "dob"
                      ? `${nextMessage} eg:(1996-07-21)`
                      : nextMessage
                  );
                }
                let dataObj = {
                  current_user: msg.from,
                  bot_response: nextMessage,
                  response_type: userExist.next_response_type,
                  next_response_type:
                    visaSequence[
                      visaSequence.indexOf(userExist.next_response_type) + 1
                    ],
                  user_response: msg.data.text || JSON.stringify(msg.data),
                  selected_category: userExist.selected_category,
                  dob: nextMessage === "dob" ? msg.data.text : userExist.dob,
                  applicationId:
                    nextMessage === "application_Id"
                      ? msg.data.text
                      : userExist.applicationId,
                };
                const res = await saveResponseData({ ...dataObj });
              }
            }
            if (userExist.next_response_type === "select_date") {
              try {
                const detailRes = await axios.get(
                  process.env.API_END_POINT +
                    `/center/${userExist.center_id}/appointment-slot`
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
                  let dbData = {
                    current_user: msg.from,
                    response_type: "selected_date",
                    next_response_type: "Appointment_book",
                    user_response: "date selected",
                    bot_response: JSON.stringify(msg.data),
                    selected_category: userExist.selected_category,
                  };
                  const res = await saveResponseData({ ...dbData });
                }
              } catch (err) {
                console.log(err, "err==>");
              }
            }
          } else {
            // Other category work
          }
        } else {
          const [messageData, resObj] = generateText("greeting");
          try {
            await bot.sendReplyButtons(msg.from, messageData, resObj);
            let dataObj = {
              current_user: msg.from,
              response_type: "greeting",
              next_response_type: "serviceList",
              user_response: msg.data.text,
              bot_response: JSON.stringify([messageData, resObj]),
            };
            const res = await saveResponseData({ ...dataObj });
          } catch (err) {
            console.log(err, "errs");
          }
        }
      } catch (err) {
        console.log(err, "err");
      }
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = responseBot;
