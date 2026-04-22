import React from "react";
import * as FaIcons from "react-icons/fa";

const AddFeildsTable = (showFormHandler, actions) => {
  return [
   
      {
      title: "Feild Name",
      align: "left",
      val: "feildName",
      render: (rowData) => <span>{rowData?.feildName}</span>,
    },
     {
      title: "Feild Value",
      align: "left",
      val: "feildValue",
      render: (rowData) => <span>{rowData?.feildValue}</span>,
    },
   
    {
      title: "edit",
      align: "center",
      render: (rowData) => (
        <>
          <span
            style={{ cursor: "pointer", color: "blue",  }}
            onClick={showFormHandler(rowData, actions[0])}
          >
            <FaIcons.FaEdit />
          </span>
         
        </>
      ),
    },
    {
      title: "delete",
      align: "center",
      render: (rowData) => (
        <>
         
          <span
            style={{ cursor: "pointer", color: "red" }}
            onClick={showFormHandler(rowData, actions[1])}
          >
            <FaIcons.FaTrash />
          </span>
        </>
      ),
    },
  ];
};

export default AddFeildsTable;
