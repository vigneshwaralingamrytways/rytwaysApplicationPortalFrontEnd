import React from "react";
import * as FaIcons from "react-icons/fa";

const ServiceTypeTable = ({showFormHandler,actions}) => [
  {
    title: "Service Type Name",
    val: "serviceTypeName",
    align:"left",
      render: (rowData) => <span>{rowData?.serviceTypeName}</span>,

  },
  
      {
        title: "Edit",
        align: "center",
        render: (rowData) => (
          <span
            style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
            onClick={showFormHandler(rowData, actions[0])}
          >
            <FaIcons.FaEdit />
          </span>
        ),
      },
      {
        title: "Delete",
        align: "center",
        render: (rowData) => (
          <span
            style={{ cursor: "pointer", color: "red" }}
            onClick={showFormHandler(rowData, actions[1])}
          >
            <FaIcons.FaTrash />
          </span>
        ),
      },
];

export default ServiceTypeTable;
