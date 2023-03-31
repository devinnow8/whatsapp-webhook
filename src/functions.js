const { saveResponseData, deleteUser } = require("./controllers/api");
const { visaSequence } = require("./constant");
const { generateText } = require("../generateText");
const axios = require("axios");

const getcategory = async (msg, userExist, bot) => {
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
    const res = await axios.get(process.env.API_END_POINT + "/category-list");
    const data = await res.data;
    if (data) {
      let tempDataa = { ...userExist.tmp_data, category_data: data };
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

const getApplicationId = async (msg, userExist, bot) => {
  let selected_category = msg?.data?.title?.toLowerCase() || userExist?.tmp_data?.selected_category?.toLowerCase()
  let tempDataaa = {
    ...userExist.tmp_data,
    selected_category: selected_category.includes('visa') ? 'visa' : selected_category,
    selected_category_id:
      msg.data.id || userExist.tmp_data.selected_category_id,
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

const getDob = async (msg, userExist, bot) => {
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

const getName = async (msg, userExist, bot) => {
  let selected_category = msg?.data?.title?.toLowerCase() || userExist?.tmp_data?.selected_category?.toLowerCase()
  let tempDataaa = {
    ...userExist.tmp_data,
    selected_category: selected_category.includes('visa') ? 'visa' : selected_category,
    selected_category_id:
      msg.data.id || userExist.tmp_data.selected_category_id,
  };
  let dataObjjj = {
    phone_number: msg.from,
    type: "Name",
    message: "selected category",
    reply_with: "selected category",
    data: JSON.stringify(msg.data),
    tmp_data: tempDataaa,
  };
  const resss = await saveResponseData({ ...dataObjjj });
  if (resss) {
    await bot.sendText(msg.from, "Please enter your Name.");
  }
};
const getNationality = async (msg, userExist, bot) => {
  let tempDataaaa = {
    ...userExist.tmp_data,
    name: msg.data.text,
  };
  let dataObjjjj = {
    phone_number: msg.from,
    type: "Nationality",
    message: msg.data.text,
    reply_with: "Nationality",
    data: JSON.stringify(msg.data),
    tmp_data: tempDataaaa,
  };
  const ressss = await saveResponseData({ ...dataObjjjj });
  if (ressss) {
    await bot.sendText(msg.from, "Please enter your Nationality.");
  }
};
const getIdType = async (msg, userExist, bot) => {
  let tempDataaaa = {
    ...userExist.tmp_data,
    nationality: msg.data.text,
  };
  let dataObjjjj = {
    phone_number: msg.from,
    type: "Id_Type",
    message: msg.data.text,
    reply_with: "Id_Type",
    data: JSON.stringify(msg.data),
    tmp_data: tempDataaaa,
  };
  const ressss = await saveResponseData({ ...dataObjjjj });
  if (ressss) {
    let selected_category = userExist?.tmp_data?.select_category?.toLowerCase()
    const nigerianIdType = [
      { name: "Nigerian Driving Licence", id: 1 },
      { name: "Nigerian International Passport", id: 2 },
      { name: "Nigerian National ID Card", id: 3 },
    ];
    let category_list = userExist.tmp_data.category_data
    const filterd = await category_list && category_list.filter((item)=> item.categoryID === Number(userExist.tmp_data.selected_category_id))
    let idList = [
      { id: 1, title: "No id type" },
    ];
    let id_list = []
    if(userExist?.tmp_data?.nationality?.toLowerCase() === "nigeria" && selected_category.includes('bvn')){
      id_list = nigerianIdType
    }
    if(userExist?.tmp_data?.nationality?.toLowerCase() !== "nigeria" && selected_category.includes('bvn')){
      id_list = [
        {
          name: "International Passport",
          id: 1,
        },
      ]
    }
    if(!selected_category.includes('bvn')){
      id_list = filterd[0].idTypes
    }
    await bot.sendList(
      msg.from,
      "Select",
      "This is a list of ID types. Please select one from the list.",
      generateText("list_id_type", id_list)
    );
  }
};
const getIdNumber = async (msg, userExist, bot) => {
  let tempDataaaa = {
    ...userExist.tmp_data,
    id_type_id: msg.data.id,
    id_type: msg.data.title,
  };
  let dataObjjjj = {
    phone_number: msg.from,
    type: "Id_Number",
    message: msg.data.text,
    reply_with: "Id_Number",
    data: JSON.stringify(msg.data),
    tmp_data: tempDataaaa,
  };
  const ressss = await saveResponseData({ ...dataObjjjj });
  if (ressss) {
    await bot.sendText(msg.from, "Please enter your ID Number.");
  }
};
const getEmail = async (msg, userExist, bot) => {
  let tempDataaaa = {
    ...userExist.tmp_data,
    Id_Number: msg.data.text,
  };
  let dataObjjjj = {
    phone_number: msg.from,
    type: "Email",
    message: msg.data.text,
    reply_with: "Email",
    data: JSON.stringify(msg.data),
    tmp_data: tempDataaaa,
  };
  const ressss = await saveResponseData({ ...dataObjjjj });
  if (ressss) {
    await bot.sendText(msg.from, "Please enter your Email id.");
  }
};
const getPhoneNumber = async (msg, userExist, bot) => {
  let email = ValidateEmail(msg.data.text);
  if (email) {
    let tempDataaaa = {
      ...userExist.tmp_data,
      email: msg.data.text,
    };
    let dataObjjjj = {
      phone_number: msg.from,
      type: "Phone_No",
      message: msg.data.text,
      reply_with: "Phone_No",
      data: JSON.stringify(msg.data),
      tmp_data: tempDataaaa,
    };
    const ressss = await saveResponseData({ ...dataObjjjj });
    if (ressss) {
      await bot.sendText(
        msg.from,
        "Please enter your Phone number in form of +91 9876543210."
      );
    }
  } else {
    let dataObjjjj = {
      phone_number: msg.from,
      type: "Email",
      message: msg.data.text,
      reply_with: "Email",
      data: JSON.stringify(msg.data),
      // tmp_data: tempDataaaa,
    };
    const ressss = await saveResponseData({ ...dataObjjjj });
    if (ressss) {
      await bot.sendText(msg.from, "Please enter your valid Email id.");
    }
  }
};
const getApplicationDetailAndcenter = async (msg, userExist, bot) => {
  let tempDataaaaa = {};
  let phoneValidat = false;
  if (userExist?.tmp_data?.selected_category?.toLowerCase() === "visa") {
    phoneValidat = true;
    tempDataaaaa = { ...userExist.tmp_data, dob: msg.data.text };
  } else {
    phoneValidat = validatePhone(msg.data.text);
    tempDataaaaa = { ...userExist.tmp_data, Phone_No: msg.data.text };
  }
  if (phoneValidat) {
    let dataObjjjjj = {
      phone_number: msg.from,
      type: "Center",
      message: msg.data.text,
      reply_with:
        userExist?.tmp_data?.selected_category?.toLowerCase() === "visa"
          ? "dob"
          : "Phone_No",
      data: JSON.stringify(msg.data),
      tmp_data: tempDataaaaa,
    };
    const resssss = await saveResponseData({ ...dataObjjjjj });
    if (resssss) {
      const {
        selected_category,
        application_id,
        Id_Number,
        id_type,
        nationality,
      } = userExist.tmp_data;
      try {
        let apiObj = {};
        if (userExist.tmp_data.selected_category.toLowerCase() === "visa") {
          apiObj = {
            applicationId: application_id,
            dob: msg.data.text,
            serviceType: selected_category,
          };
        } else {
          apiObj = {
            applicationId: Id_Number,
            category: selected_category,
            country: nationality,
            email: userExist.tmp_data.email,
            id_number: Id_Number,
            id_type: id_type,
            name: userExist.tmp_data.name,
            nationality: nationality,
            phone_number: msg.data.text,
            serviceType: selected_category,
          };
        }
        const detailRes = await axios.post(
          process.env.API_END_POINT + "/application-detail",
          {
            ...apiObj,
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
            await getCenterList(msg, bot);
          }
        } else {
          let tempDataaa = { ...userExist.tmp_data };
          let dataaObjj = {
            phone_number: msg.from,
            type: "select_category",
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
        let tempDataaa = { ...userExist.tmp_data };
        let dataaObjj = {
          phone_number: msg.from,
          type: "select_category",
          message: "Application not found",
          reply_with: "",
          data: JSON.stringify(msg.data),
          // tmp_data: tempDataaa,
        };
        const res = await saveResponseData({ ...dataaObjj });
        if (res) {
          bot.sendText(msg.from, `Application not found. type hey `);
          await deleteUser(msg.from);
        }
      }
    }
  } else {
    let dataObjjjj = {
      phone_number: msg.from,
      type: "Phone_No",
      message: msg.data.text,
      reply_with: "Phone_No",
      data: JSON.stringify(msg.data),
      // tmp_data: tempDataaaa,
    };
    const ressss = await saveResponseData({ ...dataObjjjj });
    if (ressss) {
      await bot.sendText(
        msg.from,
        "Please enter your Phone number in form of +91 9876543210."
      );
    }
  }
};
const getSlots = async (msg, userExist, bot) => {
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
        process.env.API_END_POINT + `/center/${msg.data.id}/appointment-slot`
      );
      const data = await detailRes.data;
      if (data.length > 0) {
        const filterdData = data && data.filter((item) => item.type === "date");
        if (filterdData) {
          await bot.sendList(
            msg.from,
            "Select",
            "This is a list of Date and time. Please select one from the list.",
            generateText("list_date", filterdData)
          );
        }
      } else {
        let data_Obj = {
          phone_number: msg.from,
          type: "Center",
          message: msg.data.text,
          reply_with: "get details",
          data: JSON.stringify(msg.data),
          // tmp_data: temp_Data,
        };
        const response = await saveResponseData({ ...data_Obj });
        if (response) {
          await getCenterList(msg, bot);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const bookAppointment = async (msg, userExist, bot) => {
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
    let apiObj = [
      {
        application_id: userExist.tmp_data.applicationId || "",
        appointment_date: dateAndTime[0] || "",
        appointment_time: dateAndTime[1] + " " + dateAndTime[2] || "",
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

const allReadyBooked = async (msg, userExist, bot) => {
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
    await deleteUser(msg.from);
  }
};

const getCenterList = async (msg, bot) => {
  try {
    const res = await axios.get(process.env.API_END_POINT + "/center-list");
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
};
const ValidateEmail = (email) => {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.match(mailformat)) {
    return true;
  } else {
    return false;
  }
};
const validatePhone = (phone) => {
  const regex = /^\+?[0-9](?:[- ]?[0-9]){6,15}$/;
  if (!regex.test(phone)) {
    return false;
  } else {
    return true;
  }
};
module.exports = {
  getcategory,
  getApplicationId,
  getDob,
  getApplicationDetailAndcenter,
  getSlots,
  bookAppointment,
  allReadyBooked,
  getName,
  getNationality,
  getIdType,
  getIdNumber,
  getEmail,
  getPhoneNumber,
};
