import React from "react";
import * as FaIcons from "react-icons/fa";

const NewExpensePaymentTable = (showFormHandler, actions) => {
  return [
    {
      align: "left",
      title: "Payment Date",
      val: "paymentDate",
      render: (row) => <span>{row.paymentDate}</span>,
    },
    {
      align: "left",
      title: "Payment Mode",
      val: "paymentMode",
      render: (row) => <span>{row.paymentMode?.paymentModeName}</span>,
    },
    {
      align: "right",
      title: "Amount",
      val: "amount",
      render: (row) => <span>{row.amount}</span>,
    },
    {
      align: "right",
      title: "TDS",
      val: "tds",
      render: (row) => <span>{row.tds}</span>,
    },
    {
      align: "right",
      title: "Paid Amount",
      val: "paidAmount",
      render: (row) => <span>{row.paidAmount}</span>,
    },
    {
      align: "right",
      title: "Balance Amount",
      val: "balanceAmount",
      render: (row) => <span>{row.balanceAmount}</span>,
    },
    {
      align: "left",
      title: "Remark",
      val: "remark",
      render: (row) => <span>{row.remark}</span>,
    },
    {
      title: "Edit",
      align: "center",
      render: (row) => (
        <span
          style={{ cursor: "pointer", color: "blue" }}
          onClick={showFormHandler(row, actions[0])}
        >
          <FaIcons.FaEdit />
        </span>
      ),
    },
    {
      title: "Delete",
      align: "center",
      render: (row) => (
        <span
          style={{ cursor: "pointer", color: "red" }}
          onClick={showFormHandler(row, actions[1])}
        >
          <FaIcons.FaTrash />
        </span>
      ),
    },
  ];
};

export default NewExpensePaymentTable;
