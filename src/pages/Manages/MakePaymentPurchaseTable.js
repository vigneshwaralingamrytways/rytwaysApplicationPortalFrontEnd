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

const MakePaymentPurchaseTable = (showFormHandler, actions) => [


  {
    title: "Invoice No",
    align: "right",
    val: "invoiceNo",
    render: (rowData) => <span>{rowData?.invoiceHeader?.invoiceNo}</span>,
  },
  {
    title: "Invoice Date",
    align: "right",
    val: "invoiceDate",
    render: (rowData) => <span>{rowData?.invoiceHeader?.invoiceDate}</span>,
  },
  {
    title: "Supplier Name ",
    align: "left",
    val: "supplierName",
    render: (rowData) => <span>{rowData?.invoiceHeader?.supplier?.supplierName}</span>,
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
    render: (row) => <span>{row.makePayment?.netTotal || row.paymentDetails?.netTotal || 0}</span>
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
    val: "cumulativePaidAmount",
    render: (row) => <span>{row.makePayment?.cumulativePaidAmount || 0}</span>
  },
  {
    title: "Balance ",
    align: "right",
    val: "balanceAmount",
    // render: (row) => <span>{row.makePayment?.balanceAmount || row.paymentDetails?.balanceAmount || 0}</span>
  
  
    render: (row) => {
      const paidAmount = row.makePayment?.cumulativePaidAmount || 0;

      return (
        <span>
          {paidAmount > 0
            ? row.makePayment?.balanceAmount ?? 0
            : row.paymentDetails?.balanceAmount ?? 0}
        </span>
      );
    }
  
  
  },

  {
      title: "Status",
      align: "right",
      val: "status",
      render: (row) => <span>{row.invoiceHeader?.status?.statusName||"Not Recived"}</span>,
    },
  //  {
  //         title: "Status",
  //         align: "right",
  //         val: "status",
  //         render: (rowData) => <span>{rowData?.status}</span>,
  //     },

  // {
  //   align: "left",
  //   title: "Status",
  //   val: "status",
  //   // render: (row) => <span>{row.status}</span>,
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
  //   title: "Doc",
  //   align: "center",
  //   render: (rowData) => (
  //     <>
  //       <span
  //         style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
  //         onClick={showFormHandler(rowData, actions[0])}
  //       >
  //         <FaIcons.FaEye />
  //       </span>

  //     </>
  //   ),
  // },


];
export default MakePaymentPurchaseTable;