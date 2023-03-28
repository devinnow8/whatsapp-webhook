const responseTable = require("../models/response.model");
const newWork = require("../models/newwork.model");
const { visaSequence } = require("../constant");

// const getResponseData = async (req, res, next) => {
//   try {
//     const isResponse = await responseTable.findOne({
//       current_user: req,
//     });
//     if (!isResponse) {
//       return false;
//     }
//     return isResponse;
//   } catch (error) {
//     return error.message;
//   }
// };

// const saveResponseData = async (req, res) => {
//   try {
//     let userExist = await getResponseData(req.current_user);

//     if (!userExist) {
//       let newResponseTable = new responseTable({ ...req });
//       newResponseTable = await newResponseTable.save();
//       if (!newResponseTable) {
//         return "not able to save";
//       }
//       return newResponseTable;
//     } else {
//       userExist = await responseTable.findOneAndUpdate(
//         { current_user: req.current_user },
//         req
//       );
//       return userExist;
//     }
//   } catch (error) {
//     return error.message;
//   }
// };

const getResponseData = async (req, res, next) => {
  try {
    const isResponse = await newWork.findOne({
      phone_number: req,
    });
    if (!isResponse) {
      return false;
    }
    return isResponse;
  } catch (error) {
    return error.message;
  }
};

const saveResponseData = async (req, res) => {
  try {
    let userExist = await getResponseData(req.phone_number);

    if (!userExist) {
      let newResponseTable = new newWork({ ...req });
      newResponseTable = await newResponseTable.save();
      if (!newResponseTable) {
        return "not able to save";
      }
      return newResponseTable;
    } else {
      userExist = await responseTable.findOneAndUpdate(
        { phone_number: req.phone_number },
        req
      );
      return userExist;
    }
  } catch (error) {
    return error.message;
  }
};

const setDbObj = async (msg, messageData, userExist, data) => {
  let tempData = { ...userExist.tmp_data, ...data };
  console.log(tempData, "tempData==>");
  let dataObj = {
    phone_number: msg.from,
    type:
      userExist.type !== ""
        ? visaSequence[visaSequence.indexOf(userExist.next_response_type) + 1]
        : visaSequence[0],
    message: msg.data.text,
    reply_with: messageData,
    data: JSON.stringify(msg.data),
    tmp_data: tempData,
  };
  const res = await saveResponseData({ ...dataObj });
  console.log(res, "resresres save db ==>");
};
module.exports = {
  getResponseData,
  saveResponseData,
  setDbObj,
};
