const { visaSequence } = require("./src/constant");

function respondToList(data) {
  switch (data.title) {
    case "visa":
      return {
        "0-btn-1": "Open Visa form",
        // "0-btn-2": "Continue Here",
      };
    default:
      return "Please select any other option!";
  }
}

function generateText(type, data) {
  switch (type) {
    case visaSequence[0]:
      return [
        "Hi, Welcome to OIS appointment booking system. Please select the category",
        { "get-list-btn": "Category List" },
      ];
      case "get_Details":
      return {
        get_Details: "get Details",
      };
      case "get_center":
        return{
          get_center: 'Get Center'
        }
    case "list":
      const dataArr =
        data.length > 0 &&
        data.map((item) => {
          return { id: item.categoryID, title: item.value };
        });
      return {
        Services: [...dataArr],
      };
    case "list_date":
      const dataList =
        data.length > 0 &&
        data.map((item) => {
          return {
            id: item.id,
            title: item.day + " " + item.fromTime,
          };
        });
      return {
        Services: [...dataList],
      };

    case "list_reply":
      return respondToList(data);
    case "button_reply":
      return respondToList(data);
    case "confirm":
      return {
        confirm: "Confirm & Continue",
        // "0-btn-2": "Continue Here",
      };
    
    case "book_appointment":
      return {
        book_appointment: "Book Appointment",
      };
    case "center_list":
      const dataArrCenter =
        data.length > 0 &&
        data.map((item) => {
          return { id: item.centerId, title: item.centerName };
        });
      return {
        Services: [...dataArrCenter],
      };
    case "select_date":
      return { select_date: "select date and time" };
    case "selected_date":
      return { selected_date: "Book appointment" };

    default:
      return "Apologies We don't accept this type of message as of now.";
  }
}

module.exports = { generateText };
