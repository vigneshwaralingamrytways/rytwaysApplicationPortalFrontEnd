import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";
//same like curencymastertable.js
const BookExpenseTable = (showFormHandler, actions) => {

  return [
    {
      title: "Expense Date",
      align: "leftr",
      val: "expenseDate",
       inpprops: {  } ,
      render: (rowData) => <span>{rowData?.expenseDate}</span>,
    },
    {
      title: "Expense Category",
      align: "left",
      val: "expenseCategory",
      render: (rowData) => <span>{rowData?.expenseCategory}</span>,
    },
    {
      title: "Expense Sub Category",
      align: "center",
      val: "expenseSubCategory",
      render: (rowData) => <span>{rowData?.expenseSubCategory}</span>,
    },
    {
      title: "Expense Amount",
      align: "right",
      val: "expenseAmount",
      render: (rowData) => <span>{rowData?.expenseAmount}</span>,
    },
    {
      title: "Remarks",
      align: "left",
      val: "remarks",
      render: (rowData) => <span>{rowData?.remarks}</span>,
    },
    // {
    //   title: "Payment Mode",
    //   align: "center",
    //   val: "expenseMode",
    //   render: (rowData) => <span>{rowData?.expenseMode}</span>,
    // },
    // {
    //   title: "Payment Reference",
    //   align: "center",
    //   val: "expenseReference",
    //   render: (rowData) => <span>{rowData?.expenseReference}</span>,
    // },
    // {
    //   title: "Payment Account Number",
    //   align: "center",
    //   val: "accountNo",
    //   render: (rowData) => <span>{rowData?.accountNo}</span>,
    // },


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
{
  title: "Upload",
  align: "center",
  render: (rowData) => (
    <span
      style={{ cursor: "pointer", color: "green" }}
      onClick={showFormHandler(rowData, "Upload")}
    >
      <FaIcons.FaUpload />
    </span>
  ),
},

  ];
};

export default BookExpenseTable;
