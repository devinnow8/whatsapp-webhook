// const list = {
//   interactive: {
//     action: {
//       button: "Action",
//       sections: [
//         {
//           rows: [
//             {
//               id: "unique-row-identifier-here",
//               title: "row-title-content-here",
//               description: "row-description-content-here",
//             },
//             {
//               id: "unique-row-identifier-here-2",
//               title: "row-title-content-here-2",
//               description: "row-description-content-here-2",
//             },
//             {
//               id: "unique-row-identifier-here-3",
//               title: "row-title-content-here-3",
//               description: "row-description-content-here-3",
//             },
//             {
//               id: "unique-row-identifier-here-4",
//               title: "row-title-content-here-4",
//               description: "row-description-content-here-4",
//             },
//           ],
//         },
//       ],
//     },
//     body: {
//       text: "This is the body of the message",
//     },
//     type: "list",
//   },
// };

function respondToList(data) {
  switch (data.title) {
    case "visa":
      return {
        "0-btn-1": "Open Visa form",
        // "0-btn-2": "Continue Here",
      };

    // case "1":
    //   return {
    //     "1-btn-1": "Open Passport form",
    //     "1-btn-2": "Continue Here",
    //   };
    // case "2":
    //   return {
    //     "2-btn-1": "Visit Website",
    //     "2-btn-2": "Continue Here",
    //   };
    default:
      return "Please select any other option!";
  }
}

function generateText(type, data) {
  switch (type) {
    case "greeting":
      return [
        "Hello Welcome to OIS appoitment booking services !",
        { "get-list-btn": "Get List" },
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
            title: item.day + " " + item.fromTime + " " + item.day,
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
    case "get_Details":
      return {
        get_Details: "get Details",
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
