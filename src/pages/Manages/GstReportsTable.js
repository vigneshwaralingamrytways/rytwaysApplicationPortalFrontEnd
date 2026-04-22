import React from "react";
import * as FaIcons from "react-icons/fa";

const GstReportsTable = (showFormHandler, actions, isGst) => {
return [
  {
    title: "Name",
    align: "left",
    val: "name",
    render: (row) => <span>{row.typeofPaymentDetails}</span>,
  },
  {
    title: "CGST",
    align: "right",
    val: "cgst",
    render: (row) => <span>{row.cgst}</span>,
  },
  {
    title: "SGST",
    align: "right",
    val: "sgst",
    render: (row) => <span>{row.sgst}</span>,
  },
  {
    title: "IGST",
    align: "right",
    val: "igst",
    render: (row) => <span>{row.igst}</span>,
  },
  {
    title: "Total GST",
    align: "right",
    val: "totalGst",
    render: (row) => <span>{row.totalGst}</span>,
  },
];

    
      };

export default GstReportsTable;
