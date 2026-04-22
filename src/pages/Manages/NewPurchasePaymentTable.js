import React from "react";
 
import * as FaIcons from "react-icons/fa";
const NewPurchasePaymentTable = (showFormHandler, actions) => {
  return [
    {
      align: "left",
      title: "Date",
      val: "paymentDate",
      render: (rowData) => <span>{rowData.paymentDate}</span>,
    },
    {
      align: "left",
      title: "Payment Mode",
      val: "paymentMode",
      
      render: (rowData) => <span>{rowData.paymentMode?.paymentModeName }</span>,
    },
    {
      align: "right",
      title: "Amount",
      val: "amount",
      render: (rowData) => <span>{rowData.amount}</span>,
    },
    {
      align: "right",
      title: "TDS",
      val: "tds",
      render: (rowData) => <span>{rowData.tds }</span>,
    },
    {
      align: "right",
      title: "Paid",
      val: "paidAmount",
      render: (rowData) => <span>{rowData.paidAmount}</span>,
    },
    {
      align: "right",
      title: "Balance",
      val: "balanceAmount",
      render: (rowData) => <span>{rowData.balanceAmount}</span>,
    },
    {
      align: "left",
      title: "Remark",
      val: "remark",
      render: (rowData) => <span>{rowData.remark}</span>,
    },
   
    {
       title: "Edit",
       align: "center",
       render: (rowData) => (
         <span
           style={{ cursor: "pointer", color: "blue" }}
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
};

export default NewPurchasePaymentTable;