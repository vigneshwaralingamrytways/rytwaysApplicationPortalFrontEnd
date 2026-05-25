import React, { useCallback, useEffect, useState } from "react";
import {
  CreateForm,
  api,
  useFetch,
  alertActions,
  modalActions,
  useDispatch,
  useSelector,
  classes,
  Popupcard,
} from "../../Components/CommonImports/CommonImports";
import * as FaIcons from 'react-icons/fa';

const MakePaymentSalesTable = (showFormHandler, actions) => [


  {
    title: "Invoice No",
    align: "right",
    val: "invoiceNo",
    render: (rowData) => <span>{rowData?.invoiceHeader?.invoiceNo||rowData?.invoiceNo}</span>,
  },
  {
    title: "Invoice Date",
    align: "right",
    val: "invoiceDate",
    render: (rowData) => <span>{rowData?.invoiceHeader?.invoiceDate||rowData?.invoiceDate}</span>,
  },
  {
    title: "customer Name ",
    align: "left",
    val: "customerId",
    render: (rowData) => <span>{rowData?.invoiceHeader?.customer?.customerName||rowData?.customer?.customerName}</span>,
  },

  // {
  //     title: "Payment Mode",
  //     align: "left",
  //     val: "paymentMode",
  //     render: (row) => <span>{row.paymentMode}</span>
  // },
  {
    title: "Amount",
    align: "right",
    val: "amount",
    render: (row) => <span>{row.paymentDetails?.netTotal || 0}</span>
  },
  // {
  //     title: "TDS",
  //     align: "right",
  //     val: "tds",
  //     render: (row) => <span>{row.tds}</span>
  // },
  {
    title: "Paid ",
    align: "right",
    val: "paid",
    render: (row) => <span>{row.paymentDetails?.utilizedAmount || 0}</span>

    // render: (row) => <span>{(row.paymentDetails?.netTotal - row.paymentDetails?.balanceAmount)||0}</span>

  },
  {
    title: "Balance ",
    align: "right",
    val: "balance",
    render: (row) => <span>{row.paymentDetails?.balanceAmount || 0}</span>



    // render: (row) => {
    //   const paidAmount = row.makePayment?.cumulativePaidAmount || 0;

    //   return (
    //     <span>
    //       {paidAmount > 0
    //         ? row.makePayment?.balanceAmount ?? 0
    //         : row.paymentDetails?.balanceAmount ?? 0}
    //     </span>
    //   );
    // }
  },

  {
    title: "Status",
    align: "right",
    val: "status",
    // render: (row) => <span>{row.invoiceHeader?.status?.statusName || "Not Recived"}</span>,
    render: (row) => {
      const statusName = row.invoiceHeader?.status?.statusName || "NOT PAID";

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
  // {
  //   title: "Status",
  //   align: "right",
  //   val: "status",
  //   // render: (rowData) => <span>{rowData?.status}</span>,
  //   render: (rowData) => {
  //     return (
  //       <select
  //         value={rowData.status || " "}>
  //         <option value="Not Received" > Not Received</option >
  //         <option value="Partly Received">Partly Received</option>
  //         <option value="Received">Received</option>
  //       </select >
  //     )
  //   },
  // },
  // {
  //     title: "Remark",
  //     align: "left",
  //     val: "remark",
  //     render: (row) => <span>{row.remark}</span>
  // },
  // {
  //  title: "Payment",
  //   align: "center",
  //   render: (row) => (
  //     <span
  //       style={{ cursor: "pointer", color: "blue" }}
  //       onClick={showFormHandler(row, actions[0])}
  //     >
  //       <FaIcons />
  //     </span>
  //   ),
  // },
  // {
  //    title: "Delete",
  //   align: "center",
  //   render: (row) => (
  //     <span
  //       style={{ cursor: "pointer", color: "red" }}
  //       onClick={showFormHandler(row, actions[1])}
  //     >
  //       <FaIcons.FaTrash />
  //     </span>
  //   ),
  // }, 
  {
    title: "Payment",
    align: "center",
    render: (rowData) => (
      <>
        <span
          style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
          onClick={showFormHandler(rowData, actions[1])}
        >
          <FaIcons.FaWallet />
        </span>

      </>
    ),
  },


  // {
  //   title: "Transaction",
  //   align: "center",
  //   render: (rowData) => (
  //     <>
  //       <span
  //         style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
  //         onClick={showFormHandler(rowData, actions[2])}
  //       >
  //         <FaIcons.FaEye />
  //       </span>

  //     </>
  //   ),
  // },


];
export default MakePaymentSalesTable;