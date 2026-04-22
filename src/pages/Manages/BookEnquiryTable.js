import React from "react";
import * as FaIcons from "react-icons/fa";

const BookEnquiryTable = (showFormHandler, actions) => {
  return [
    {
      title: "Enquiry Date",
      align: "left",
      val: "enquiryDate",
      render: (rowData) => <span>{rowData?.enquiryDate}</span>,
    },
    {
      title: "Customer Name",
      align: "left",
      val: "customerName",
      render: (rowData) => (
        <span>{rowData?.customer?.customerName || rowData?.customerName}</span>
      ),
    },
    {
      title: "Enquiry Description",
      align: "left",
      val: "enquiryDescription",
      render: (rowData) => (
        <span>{rowData?.enquiryDescription}</span>
      ),
    },
    {
      title: "Edit",
      align: "center",
      render: (rowData) => (
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={showFormHandler(rowData, "Edit")}
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
          onClick={showFormHandler(rowData, "Delete")}
        >
          <FaIcons.FaTrash />
        </span>
      ),
    },
     
  ];
};

export default BookEnquiryTable;
