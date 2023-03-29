const { createBot } = require("whatsapp-cloud-api");
const { getResponseData, deleteUser } = require("./controllers/api");
const {
  getcategory,
  getApplicationId,
  getDob,
  getApplicationDetailAndcenter,
  getSlots,
  bookAppointment,
  allReadyBooked,
} = require("./functions");

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

    // Listen to ALL incoming messages
    bot.on("message", async (msg) => {
      console.log(msg, "msgmsg==>");
      let userExist = await getResponseData(msg.from);
      try {
        if (!userExist) {
          await getcategory(msg, userExist, bot);
        } else {
          let hours = diff_hours(new Date(), new Date(userExist.updatedAt));
          if (hours > 0) {
            await deleteUser(msg.from);
            await getcategory(msg, userExist, bot);
          } else {
            if (
              (msg.type === "list_reply" || msg.type === 'text') &&
              userExist.type === "select_category"
            ) {
              await getApplicationId(msg, userExist, bot);
            }
            if (userExist.type === "Application_id") {
              await getDob(msg, userExist, bot);
            }
            if (userExist.type === "DOB") {
              await getApplicationDetailAndcenter(msg, userExist, bot);
            }
            if (msg.type === "list_reply" && userExist.type === "Center") {
              await getSlots(msg, userExist, bot);
            }
            if (msg.type === "list_reply" && userExist.type === "Date_Time") {
              await bookAppointment(msg, userExist, bot);
            }
            if (msg.type === "button_reply" && msg.data.id === "confirm") {
              await allReadyBooked(msg, userExist, bot);
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
