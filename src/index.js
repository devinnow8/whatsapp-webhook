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
        if (msg.type === "button_reply") {
          // if (msg.data.id === "get_Details") {
          //   const { selected_category, application_id } = userExist.tmp_data;
          //   console.log(userExist, "userrrr===>");
          //   try {
          //     const detailRes = await axios.post(
          //       process.env.API_END_POINT + "/application-detail",
          //       {
          //         applicationId: application_id,
          //         dob: userExist.tmp_data.dob,
          //         serviceType: selected_category,
          //       }
          //     );
          //     const data = await detailRes.data;
          //     const {
          //       appointmentId,
          //       appointmentDate,
          //       appointmentTime,
          //       applicantFullName,
          //       status,
          //       price,
          //       currency,
          //       phone_number,
          //       email,
          //       applicationId,
          //       name,
          //       country,
          //       category,
          //       dob,
          //       service_type,
          //     } = data;
          //     if (!appointmentId) {
          //       const newObj = {
          //         applicationId,
          //         name,
          //         country,
          //         category,
          //         dob,
          //         email,
          //         phone_number,
          //         service_type,
          //         status,
          //         price,
          //         currency,
          //       };

          //       let temp_Data = { ...userExist.tmp_data, ...newObj };
          //       let data_Obj = {
          //         phone_number: msg.from,
          //         type:
          //           userExist.type !== ""
          //             ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
          //             : visaSequence[0],
          //         message: msg.data.text,
          //         reply_with: "get details",
          //         data: JSON.stringify(msg.data),
          //         tmp_data: temp_Data,
          //       };
          //       const res = await saveResponseData({ ...data_Obj });
          //       if (res) {
          //         let msgs = "";
          //         Object.keys(newObj).forEach((item) => {
          //           msgs = `${item}: ${newObj[item]}`;
          //         });
          //         setTimeout(() => {
          //           // bot.sendText(msg.from, msgs);
          //           bot.sendReplyButtons(
          //             msg.from,
          //             msgs,
          //             generateText("get_center", msg.data)
          //           );
          //         }, 700);
          //       }
          //     } else {
          //       const newObj = {
          //         appointmentId,
          //         appointmentDate,
          //         appointmentTime,
          //         applicantFullName,
          //         status,
          //         price,
          //         currency,
          //         phone_number,
          //         email,
          //       };
          //       bot.sendText(
          //         msg.from,
          //         "An appointment has been already booked with your appointment Id. Check for Details Below.",
          //         `https://ois-appointment-user.web.app/reschedule-appointment/?appointmentId=${appointmentId}`,
          //         {preview_url:true}
          //       );
          //       // setTimeout(() => {
          //       //   Object.keys(newObj).forEach((item) => {
          //       //     bot.sendText(msg.from, `${item}: ${newObj[item]}`);
          //       //   });
          //       // }, 700);
          //       let tempDataaa = { ...userExist.tmp_data };
          //       let dataaObjj = {
          //         phone_number: msg.from,
          //         type: "Welcome_Message",
          //         message:
          //           "An appointment has been already booked with your appointment Id. Check for Details Below.",
          //         reply_with: "",
          //         data: JSON.stringify(msg.data),
          //         tmp_data: tempDataaa,
          //       };
          //       const res = await saveResponseData({ ...dataaObjj });
          //       // if (res) {
          //       //   bot.sendReplyButtons(
          //       //     msg.from,
          //       //     "Confirm",
          //       //     generateText("confirm", {})
          //       //   );
          //       // }
          //     }
          //   } catch (err) {
          //     console.log(err);
          //   }
          // }
          // if (msg.data.id === "get_center") {
          //   try {
          //     const res = await axios.get(
          //       process.env.API_END_POINT + "/center-list"
          //     );
          //     const data = await res.data;
          //     if (data) {
          //       await bot.sendList(
          //         msg.from,
          //         "Select",
          //         "This is a list of centers. Please select one from the list.",
          //         generateText("center_list", data)
          //       );
          //     }
          //   } catch (err) {
          //     console.log(err);
          //   }
          // }
          // if (msg.data.id === "get_DateAndTime") {
          //   try {
          //     const detailRes = await axios.get(
          //       process.env.API_END_POINT +
          //         `/center/${userExist.tmp_data.center_id}/appointment-slot`
          //     );
          //     console.log(detailRes, "detailResdetailRes==>>>");
          //     const data = await detailRes.data;
          //     const filterdData =
          //       data && data.filter((item) => item.type === "date");
          //     if (filterdData) {
          //       await bot.sendList(
          //         msg.from,
          //         "Select",
          //         "This is a list of Date and time. Please select one from the list.",
          //         generateText("list_date", filterdData)
          //       );
          //     }
          //   } catch (err) {
          //     console.log(err);
          //   }
          // }
          if (msg.data.id === "book_appointment") {
            try {
              let apiObj = [
                {
                  application_id: userExist.tmp_data.applicationId || "",
                  appointment_date: userExist.tmp_data.selected_date || "",
                  appointment_time: userExist.tmp_data.selected_time || "",
                  appointment_day: userExist.tmp_data.selected_day || "",
                  applicant_fullname: userExist.tmp_data.name || "",
                  category: userExist.tmp_data.selected_category || "",
                  country: userExist.tmp_data.country || "",
                  service_type: userExist.tmp_data.service_type || "",
                  id_number: userExist.tmp_data.id_number || "",
                  currency: userExist.tmp_data.currency || "",
                  id_type: userExist.tmp_data.id_type || "",
                  dob: userExist.tmp_data.dob || "",
                  email: userExist.tmp_data.email || "",
                  phone_number: userExist.tmp_data.phone || "",
                  price: userExist.tmp_data.price || "",
                },
              ];
              const detailRes = await axios.post(
                process.env.API_END_POINT +
                  `/center/${userExist.tmp_data.center_id}/appointment`,
                apiObj
              );
              const data = await detailRes.data;
              if (data) {
                let dataObjjjj = {
                  phone_number: msg.from,
                  type: "Booking_slip",
                  message: "Booking slip",
                  reply_with: "Booking_slip",
                  data: JSON.stringify(msg.data),
                  tmp_data: {
                    ...userExist.tmp_data,
                    Booking_slip: `https://ois-appointment-user.web.app/reschedule-appointment/?appointmentId=${data.appointment_ids[0]}`,
                  },
                };
                const resss = await saveResponseData({ ...dataObjjjj });
                if (resss) {
                  // bot.sendReplyButtons(
                  //   msg.from,
                  //   "Thank you for booking the appointment. We have emailed you the appointment booking slip. For more details, click here:",
                  //   generateText("get_slip", msg.data)
                  // );
                  bot.sendText(
                    msg.from,
                    `Thank you for booking the appointment. We have emailed you the appointment booking slip. For more details, click here: https://ois-appointment-user.web.app/reschedule-appointment/?appointmentId=${data.appointment_ids[0]}`,
                    { preview_url: true }
                  );
                }
              }
            } catch (err) {
              console.log(err);
            }
          }
          if (msg.data.id === "confirm") {
            let dataObjjj = {
              phone_number: msg.from,
              type:
                userExist.type !== ""
                  ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                  : visaSequence[0],
              message: "selected category",
              reply_with: "selected category",
              data: JSON.stringify(msg.data),
              tmp_data: { ...userExist.tmp_data },
            };
            const resss = await saveResponseData({ ...dataObjjj });
            if (resss) {
              await bot.sendText(
                msg.from,
                visaSequence[visaSequence.indexOf(userExist.type) + 1]
              );
            }
          }
          // if (msg.data.id === "get_slip") {
          //   let url = userExist.tmp_data.Booking_slip;
          //   await bot.sendText(msg.from, url, {
          //     preview_url: true,
          //   });
          // }
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
              reply_with: "select center",
              data: JSON.stringify(msg.data),
              tmp_data: tmpData,
            };
            const response = await saveResponseData({ ...objData });
            console.log(response, "responseresponse==>");
            if (response) {
              // await bot.sendReplyButtons(
              //   msg.from,
              //   "Please choose the available slot 10 slots (date time) and more button",
              //   generateText("get_DateAndTime", msg.data)
              // );
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
          if (userExist.type === "Date_Time") {
            let dateAndTime = msg.data.title.split(" ");
            let data_obj = {
              ...userExist.tmp_data,
              selected_date: dateAndTime[0],
              selected_time: dateAndTime[1] + " " + dateAndTime[2],
            };
            let objjData = {
              phone_number: msg.from,
              type:
                userExist.type !== ""
                  ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                  : visaSequence[0],
              message: msg.data.text,
              reply_with: "confrm",
              data: JSON.stringify(msg.data),
              tmp_data: data_obj,
            };
            const response = await saveResponseData({ ...objjData });
            console.log(response, "responseresponse==>");
            if (response) {
              await bot.sendReplyButtons(
                msg.from,
                "Book appointment",
                generateText("book_appointment", msg.data)
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
              const { selected_category, application_id } = userExist.tmp_data;
              console.log(userExist, "userrrr===>");
              try {
                const detailRes = await axios.post(
                  process.env.API_END_POINT + "/application-detail",
                  {
                    applicationId: application_id,
                    dob: msg.data.text,
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
                    status,
                    price,
                    currency,
                  };

                  let temp_Data = { ...userExist.tmp_data, ...newObj };
                  let data_Obj = {
                    phone_number: msg.from,
                    type:
                      userExist.type !== ""
                        ? visaSequence[visaSequence.indexOf(userExist.type) + 1]
                        : visaSequence[0],
                    message: msg.data.text,
                    reply_with: "get details",
                    data: JSON.stringify(msg.data),
                    tmp_data: temp_Data,
                  };
                  const res = await saveResponseData({ ...data_Obj });
                  if (res) {
                    setTimeout(() => {
                      Object.keys(newObj).forEach((item) => {
                        bot.sendText(msg.from, `${item}: ${newObj[item]}`);
                      });
                    }, 700);
                    // bot.sendReplyButtons(
                    //   msg.from,
                    //   msgs,
                    //   generateText("get_center", msg.data)
                    // );
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
                } else {
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
                    `An appointment has been already booked with your appointment Id. Check for Details Below. https://ois-appointment-user.web.app/reschedule-appointment/?appointmentId=${appointmentId}`,
                    { preview_url: true }
                  );
                  // setTimeout(() => {
                  //   Object.keys(newObj).forEach((item) => {
                  //     bot.sendText(msg.from, `${item}: ${newObj[item]}`);
                  //   });
                  // }, 700);
                  let tempDataaa = { ...userExist.tmp_data };
                  let dataaObjj = {
                    phone_number: msg.from,
                    type: "Welcome_Message",
                    message:
                      "An appointment has been already booked with your appointment Id. Check for Details Below.",
                    reply_with: "",
                    data: JSON.stringify(msg.data),
                    tmp_data: tempDataaa,
                  };
                  const res = await saveResponseData({ ...dataaObjj });
                  // if (res) {
                  //   bot.sendReplyButtons(
                  //     msg.from,
                  //     "Confirm",
                  //     generateText("confirm", {})
                  //   );
                  // }
                }
              } catch (err) {
                console.log(err);
              }
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
