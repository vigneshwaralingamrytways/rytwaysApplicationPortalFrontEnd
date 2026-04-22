import React from "react";
import * as FaIcons from "react-icons/fa";

const HsnCodeTable = ({showFormHandler,actions}) => [
  {
    title: "HSN Code",
    val: "hsnCode", align: "left",
    render: (rowData) => <span>{rowData?.hsnCode}</span>,

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
  },];

export default HsnCodeTable;
