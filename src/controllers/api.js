const newWork = require("../models/newwork.model");

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
      userExist = await newWork.findOneAndUpdate(
        { phone_number: req.phone_number },
        req
      );
      return userExist;
    }
  } catch (error) {
    return error.message;
  }
};
const deleteUser = async (req, res) => {
  try {
    let userExist = await getResponseData(req);
    if (userExist) {
      newWork
        .deleteOne({ phone_number: { $eq: req } })
        .then(function () {
          console.log("Data deleted"); // Success
        })
        .catch(function (error) {
          console.log(error); // Failure
        });
    }
  } catch (err) {
    return err.message;
  }
};

module.exports = {
  getResponseData,
  saveResponseData,
  deleteUser,
};
