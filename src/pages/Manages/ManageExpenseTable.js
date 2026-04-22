import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";

const ManageExpenseTable = ({ showFormHandler, actions, isReconsile }) => {


  if (isReconsile) {
    return [
      {
        title: "Expense date",
        align: "right",
        val: "expenseDate",
        render: (rowData) => <span>{rowData?.expenseDate}</span>,
      },

      {
        title: "Expense Desc",
        align: "right",
        val: "expenseDesc",
        render: (rowData) => <span>{rowData?.expenseDesc}</span>,
      },
      {
        title: "Exp catagory",
        align: "left",
        val: "expenseCatagory",
        render: (rowData) => (
          <span>{rowData.expenseCatagory?.expenseCatagory}</span>
        ),
      },
      {
        title: "Exp Sub catagory",
        align: "left",
        val: "expenseSubCatagory",
        render: (rowData) => (
          <span>{rowData.expenseSubCatagory?.expenseSubCatagory}</span>
        ),
      },
      {
        title: "Amount",
        align: "right",
        val: "amount",
        render: (rowData) => (
          <span>{rowData?.amount}</span>
        ),
      },
    ]
  }


  return [
    {
      title: "Expense date",
      align: "right",
      val: "expenseDate",
      render: (rowData) => <span>{rowData?.expenseDate}</span>,
    },

    {
      title: "Expense Desc",
      align: "right",
      val: "expenseDesc",
      render: (rowData) => <span>{rowData?.expenseDesc}</span>,
    },
    // {
    //   title: "Seq No",
    //   align: "right",
    //   val: "ExpensSeqNo",
    //   render: (rowData) => <span>{rowData?.ExpensSeqNo}</span>,
    // }, 
    // {
    //   title: "Expense Name",
    //   align: "left",
    //   val: "ExpenseName",
    //   render: (rowData) => <span>{rowData?.ExpenseName}</span>,
    // },



    {
      title: "Exp catagory",
      align: "left",
      val: "expenseCatagory",
      render: (rowData) => (
        <span>{rowData.expenseCatagory?.expenseCatagory}</span>
      ),
    },
    {
      title: "Exp Sub catagory",
      align: "left",
      val: "expenseSubCatagory",
      render: (rowData) => (
        <span>{rowData.expenseSubCatagory?.expenseSubCatagory}</span>
      ),
    },
    {
      title: "Amount",
      align: "right",
      val: "amount",
      render: (rowData) => (
        <span>{rowData?.amount}</span>
      ),
    },
    {
      title: "Paid ",
      align: "right",
      val: "paid",
      render: (rowData) => (
        <span>{rowData?.paid}</span>
      ),
    },
    {
      title: "Balance ",
      align: "right",
      val: "balance",
      render: (rowData) => (
        <span>{rowData?.balance}</span>
      ),
    },

    // {
    //   title: "Payment",
    //   align: "center",
    //   render: (rowData) => (
    //     <>
    //       <span
    //         style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
    //         onClick={showFormHandler(rowData, actions[3])}
    //       >
    //         <FaIcons.FaWallet/>
    //       </span>

    //     </>
    //   ),
    // },
    // {
    //   title: "Edit",
    //   align: "center",
    //   render: (rowData) => (
    //     <>
    //       <span
    //         style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
    //         onClick={showFormHandler(rowData, actions[0])}
    //       >
    //         <FaIcons.FaEdit />
    //       </span>

    //     </>
    //   ),
    // },

    {
      title: "Upload",
      align: "center",
      render: (rowData) => (
        <>
          <span
            style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
            onClick={showFormHandler(rowData, actions[2])}
          >
            <FaIcons.FaUpload />
          </span>

        </>
      ),
    },

    {
      title: "Edit",
      align: "center",
      render: (rowData) => (
        <>
          <span
            style={{ cursor: "pointer", color: "red" }}
            onClick={showFormHandler(rowData, actions[0])}
          >
            <FaIcons.FaEdit />
          </span>
        </>
      ),
    },

    {
      title: "Delete",
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

export default ManageExpenseTable;
