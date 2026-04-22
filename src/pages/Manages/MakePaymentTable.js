import React from "react";
import * as FaIcons from "react-icons/fa";

const MakePaymentTable = (showFormHandler, actions) => {
  return [
  
 
  {
            title: "Invoice No",
            align: "right",
            val: "invoiceNo",
            render: (rowData) => <span>{rowData?.invoiceNo}</span>,
        },
         {
            title: "Invoice Date",
            align: "left",
            val: "invoiceDate",
            render: (rowData) => <span>{rowData?.invoiceDate}</span>,
        },
       {
            title: "Customer Name ",
            align: "left",
            val: "customerName",
            render: (rowData) => <span>{rowData?.customerName}</span>,
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
        render: (row) => <span>{row.amount}</span>
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
        val: "paidAmount",
        render: (row) => <span>{row.paidAmount}</span>
    },
    {
        title: "Balance ",
        align: "right",
        val: "balanceAmount",
        render: (row) => <span>{row.balanceAmount}</span>
    },
     {
            title: "Status",
            align: "right",
            val: "status",
            render: (rowData) => <span>{rowData?.status}</span>,
        },
    //
  
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
    
        {
          title: "Doc",
          align: "center",
          render: (rowData) => (
            <>
              <span
                style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
                onClick={showFormHandler(rowData, actions[4])}
              >
                <FaIcons.FaEye/>
              </span>
    
            </>
          ),
        },
    
        
  ];
};

export default MakePaymentTable;
