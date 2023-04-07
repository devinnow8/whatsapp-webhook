function generateText(type, data) {
  switch (type) {
    case "Welcome_Message":
      return [
        "Hi, Welcome to OIS appointment booking system. Please select the category",
        { "get-list-btn": "Category List" },
      ];
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
      case "list_countries":
        const dataCountries =
        data.length > 0 &&
        data.map((item) => {
          return {
            id: item.value,
            title: item.label,
          };
        });
      return {
        Services: [...dataCountries],
      };
    case "list_id_type":
      const List_id =
        data.length > 0 &&
        data.map((item) => {
          return {
            id: item.id,
            // title: item.name,
            description:item.name
          };
        });
      return {
        Services: [...List_id],
      };

    case "book_appointment":
      return {
        book_appointment: "Book Appointment",
      };
    case "confirm":
      return {
        confirm: "Confirm & Continue",
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
    default:
      return "Apologies We don't accept this type of message as of now.";
  }
}

module.exports = { generateText };
