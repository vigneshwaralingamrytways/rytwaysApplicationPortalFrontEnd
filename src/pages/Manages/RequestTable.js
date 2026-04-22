import React from "react";
import * as FaIcons from "react-icons/fa";

const RequestTable = ({showFormHandler, actions}) => {
  return [
    {
      title: "Request Date",
      align: "left",
      val: "requestDate",
      render: (rowData) => <span>{rowData?.requestDate}</span>,
    },
    {
      title: "Type Of Request",
      align: "left",
      val: "requestType",
      render: (rowData) => <span>{rowData?.requestType}</span>,
    },
    {
      title: "Purpose",
      align: "left",
      val: "purpuse",
      render: (rowData) => <span>{rowData?.purpuse}</span>,
    },
    {
      title: "Request Desc",
      align: "requestDesc",
      render: (rowData) => <span>{rowData?.requestDesc}</span>,
    },
     {
          title: "Edit",
          align: "center",
          render: (rowData) => (
            <span
              style={{
                cursor: "pointer",
                color: "blue",
              }}
              onClick={showFormHandler(rowData, actions[0])} 
            >
              <FaIcons.FaEdit />
            </span>
          ),
        },
        ...(actions.includes("Delete")
      ? [
    {
          title: "Delete",
          align: "center",
          render: (rowData) => (
            <span
              style={{
                cursor: "pointer",
                color: "blue",
              }}
              onClick={showFormHandler(rowData, actions[1])}
            >
              <FaIcons.FaTrash/>
            </span>
          ),
        },
    
    ]
      : []),
  ];
};

export default RequestTable;