const { createBot } = require("whatsapp-cloud-api");
const { generateText } = require("../generateText");
const axios = require("axios");
const {
  getResponseData,
  saveResponseData,
  deleteUser,
} = require("./controllers/api");
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

    const diff_hours = (dt2, dt1) => {
      var diff = (dt2.getTime() - dt1.getTime()) / 1000;
      diff /= 60 * 60;
      return Math.abs(Math.round(diff));
    };

    // functions

    const getcategory = async (msg, userExist) => {
      let tempData = { ...userExist.tmp_data };
      let dataObj = {
        phone_number: msg.from,
        type: "Welcome_Message",
        message: msg.data.text,
        reply_with:
          "Hi, Welcome to OIS appointment booking system. Please select the category",
        data: JSON.stringify(msg.data),
        tmp_data: tempData,
      };
      const response = await saveResponseData({ ...dataObj });
      if (response) {
        const res = await axios.get(
          process.env.API_END_POINT + "/category-list"
        );
        const data = await res.data;
        if (data) {
          let tempDataa = { ...userExist.tmp_data };
          let dataObjj = {
            phone_number: msg.from,
            type: "select_category",
            message:
              "Hi, Welcome to OIS appointment booking system. Please select the category",
            reply_with: "",
            data: JSON.stringify(msg.data),
            tmp_data: tempDataa,
          };
          const res = await saveResponseData({ ...dataObjj });
          if (res) {
            await bot.sendList(
              msg.from,
              "Select",
              "Hi, Welcome to OIS appointment booking system. Please select the category",
              generateText("list", data)
            );
          }
        }
      }
    };

    const getApplicationId = async (msg, userExist) => {
      let tempDataaa = {
        ...userExist.tmp_data,
        selected_category: msg.data.title,
        selected_category_id: msg.data.id,
      };
      let dataObjjj = {
        phone_number: msg.from,
        type: "Application_id",
        message: "selected category",
        reply_with: "selected category",
        data: JSON.stringify(msg.data),
        tmp_data: tempDataaa,
      };
      const resss = await saveResponseData({ ...dataObjjj });
      if (resss) {
        await bot.sendText(
          msg.from,
          visaSequence[visaSequence.indexOf(userExist.type) + 1] ===
            "Application_id"
            ? "Please enter your Application Id. If you have not filled the application yet, please click on the link attached."
            : visaSequence[visaSequence.indexOf(userExist.type) + 1]
        );
      }
    };

    const getDob = async (msg, userExist) => {
      let tempDataaaa = {
        ...userExist.tmp_data,
        application_id: msg.data.text,
      };
      let dataObjjjj = {
        phone_number: msg.from,
        type: "DOB",
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
            ? "Please enter your date of birth in form of yyyy-mm-dd (for example if your date of birth is 22 may 1990 then enter it like: 1990-05-22)"
            : visaSequence[visaSequence.indexOf(userExist.type) + 1]
        );
      }
    };

    const getApplicationDetailAndcenter = async (msg, userExist) => {
      let tempDataaaaa = { ...userExist.tmp_data, dob: msg.data.text };
      let dataObjjjjj = {
        phone_number: msg.from,
        type: "Center",
        message: msg.data.text,
        reply_with: "dob",
        data: JSON.stringify(msg.data),
        tmp_data: tempDataaaaa,
      };
      const resssss = await saveResponseData({ ...dataObjjjjj });
      if (resssss) {
        const { selected_category, application_id } = userExist.tmp_data;
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
              type: "Center",
              message: msg.data.text,
              reply_with: "get details",
              data: JSON.stringify(msg.data),
              tmp_data: temp_Data,
            };
            const res = await saveResponseData({ ...data_Obj });
            if (res) {
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
            if (res) {
              bot.sendText(
                msg.from,
                `An appointment has been already booked with your appointment Id. Check for Details Below. https://ois-appointment-user.web.app/reschedule-appointment/?appointmentId=${appointmentId}`,
                { preview_url: true }
              );
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    const getSlots = async (msg, userExist) => {
      let tmpData = {
        ...userExist.tmp_data,
        center_id: msg.data.id,
        center_name: msg.data.title,
      };
      let objData = {
        phone_number: msg.from,
        type: "Date_Time",
        message: msg.data.text,
        reply_with: "select center",
        data: JSON.stringify(msg.data),
        tmp_data: tmpData,
      };
      const response = await saveResponseData({ ...objData });
      if (response) {
        try {
          const detailRes = await axios.get(
            process.env.API_END_POINT +
              `/center/${msg.data.id}/appointment-slot`
          );
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
    };

    const bookAppointment = async (msg, userExist) => {
      let dateAndTime = msg.data.title.split(" ");
      let data_obj = {
        ...userExist.tmp_data,
        selected_date: dateAndTime[0],
        selected_time: dateAndTime[1] + " " + dateAndTime[2],
      };
      let objjData = {
        phone_number: msg.from,
        type: "Confirm",
        message: msg.data.text,
        reply_with: "confrm",
        data: JSON.stringify(msg.data),
        tmp_data: data_obj,
      };
      const response = await saveResponseData({ ...objjData });
      if (response) {
        // await bot.sendReplyButtons(
        //   msg.from,
        //   "Book appointment",
        //   generateText("book_appointment", msg.data)
        // );

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
            await deleteUser(msg.from);
            bot.sendText(
              msg.from,
              `Thank you for booking the appointment. We have emailed you the appointment booking slip. For more details, click here: https://ois-appointment-user.web.app/reschedule-appointment/?appointmentId=${data.appointment_ids[0]}`,
              { preview_url: true }
            );
          }
        }
      }
    };

    const allReadyBooked = async (msg, userExist) => {
      let dataObjjj = {
        phone_number: msg.from,
        type: "select_category",
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
    };
    // Listen to ALL incoming messages
    bot.on("message", async (msg) => {
      console.log(msg, "msgmsg==>");
      let userExist = await getResponseData(msg.from);

      try {
        if (!userExist) {
          getcategory(msg, userExist);
        } else {
          let hours = diff_hours(new Date(), new Date(userExist.updatedAt));
          console.log(hours, "hourshourshours==>");
          if (hours > 0) {
            await deleteUser(msg.from);
          } else {
            if (
              msg.type === "list_reply" &&
              userExist.type === "select_category"
            ) {
              await getApplicationId(msg, userExist);
            }
            if (userExist.type === "Application_id") {
              await getDob(msg, userExist);
            }
            if (userExist.type === "DOB") {
              await getApplicationDetailAndcenter(msg, userExist);
            }
            if (msg.type === "list_reply" && userExist.type === "Center") {
              await getSlots(msg, userExist);
            }
            if (msg.type === "list_reply" && userExist.type === "Date_Time") {
              await bookAppointment(msg, userExist);
            }
            if (msg.type === "button_reply" && msg.data.id === "confirm") {
              await allReadyBooked(msg, userExist);
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
