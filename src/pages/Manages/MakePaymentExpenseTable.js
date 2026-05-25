import { Type } from "lucide-react";
import React from "react";
import * as FaIcons from "react-icons/fa";

const MakePaymentExpenseTable = ({ showFormHandler, actions }) => {
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
      title: "Exp Category",
      align: "left",
      val: "CategoryName",
      render: (rowData) => (
        <span>{rowData?.expenseCatagory?.expenseCatagory}</span>
      ),
    },
    {
      title: "Exp Sub Category",
      align: "left",
      val: "expenseSubCatagory",
      render: (rowData) => (
        <span>{rowData?.expenseSubCatagory?.expenseSubCatagory}</span>
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
      title: "Paid Amount",
      align: "right",
      val: "paid",
      render: (rowData) => (
        <span>{rowData?.paid}</span>
      ),
    },
    {
      title: "Balance Amount",
      align: "right",
      val: "balance",
      render: (rowData) => (
        <span>{rowData?.balance}</span>
      ),
    },
    {
    title: "Status",
    align: "right",
    val: "status",
    // render: (row) => <span>{row.invoiceHeader?.status?.statusName || "Not Recived"}</span>,
    render: (row) => {
      const statusName = row?.status?.statusName || "NOT PAID";

      let statusColor = "";
      if (statusName === 'PAID') {
        statusColor = "green";
      } else if (statusName === 'NOT PAID') {
        statusColor = "red";
      } else if (statusName === 'PARTLY PAID') {
        statusColor = "yellow";
      }

      return (
        <div style={{
          backgroundColor: statusColor,
          color: "black",
          fontWeight: "700",
          fontSize: "12px",
          padding: "4px 10px",
          borderRadius: "6px",
          textAlign: "center",
          display: "inline-block",
          minWidth: "100px"
        }}>
          {statusName}
        </div>
      );
    }
  },

    {
      title: "Payment",
      align: "center",
      render: (rowData) => (
        <>
          <span
            style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
            onClick={showFormHandler(rowData, actions[3])}
          >
            <FaIcons.FaWallet/>
          </span>

        </>
      ),
    },
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

    // {
    //   title: "Doc",
    //   align: "center",
    //   render: (rowData) => (
    //     <>
    //       <span
    //         style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
    //         onClick={showFormHandler(rowData, actions[2])}
    //       >
    //         <FaIcons.FaEye/>
    //       </span>

    //     </>
    //   ),
    // },

    // {
    //   title: "Delete",
    //   align: "center",
    //   render: (rowData) => (
    //     <>
    //       <span
    //         style={{ cursor: "pointer", color: "red" }}
    //         onClick={showFormHandler(rowData, actions[1])}
    //       >
    //         <FaIcons.FaTrash />
    //       </span>
    //     </>
    //   ),
    // },
  ];
};

export default MakePaymentExpenseTable;