import React from "react";

const ReconcileMappingTable = () => {
  return [
    {
      title: "Invoice No",
      align: "left",
      val: "invoiceNo",
      render: (rowData) => <span>{rowData?.header?.invoiceNo}</span>,
    },
     {
      title: "Invoice Date",
      align: "left",
      val: "invoiceDate",
      render: (rowData) => <span>{rowData?.header?.invoiceDate}</span>,
    },
    {
      title: "customer Name",
      align: "left",
      val: "customerName",
      render: (rowData) => <span>{rowData?.header?.customer?.customerName}</span>,
    },
     {
      title: "Voucher No",
      align: "left",
      val: "voucherNo",
      render: (rowData) => <span>{rowData?.bankTransaction?.voucherNo}</span>,
    },
      {
      title: "Net Total",
      align: "left",
      val: "netTotal",
      render: (rowData) => <span>{rowData?.header?.paymentDetails?.netTotal}</span>,
    },
      {
      title: "Balance Amount",
      align: "left",
      val: "balanceAmount",
      render: (rowData) => <span>{rowData?.header?.paymentDetails?.balanceAmount}</span>,
    },
    // {
    //   title: "Reference Type",
    //   align: "left",
    //   val: "referenceType",
    //   render: (rowData) => (
    //     <span style={{ fontWeight: "bold", color: "#555" }}>
    //       {rowData?.referenceType}
    //     </span>
    //   ),
    // },
    {
      title: "Utilized Amount",
      align: "right",
      val: "amountUtilized",
     
      render: (rowData) => <span>{rowData?.header?.paymentDetails?.utilizedAmount}</span>,
    },
    // {
    //   title: "Mapped Date",
    //   align: "center",
    //   val: "mappedDate",
    //   render: (rowData) => <span>{rowData?.mappedDate || "-"}</span>,
    // },
  ];
};

export default ReconcileMappingTable;