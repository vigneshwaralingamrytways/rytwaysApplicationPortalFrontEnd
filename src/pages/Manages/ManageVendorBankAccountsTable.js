import React from "react";
import * as FaIcons from "react-icons/fa";

const ManageVendorBankAccountsTable = ({showFormHandler, actions}) => {
  return [
    {
      title: "Vendor Name",
      align: "left",
      val: "referenceName",
      render: (rowData) => <span>{rowData?.customer?.customerName}</span>,
    },
    {
      title: "Address",
      align: "left",
      val: "address",
      render: (rowData) => <span>{rowData?.address}</span>,
    },
    {
      title: "Bank Name",
      align: "left",
      val: "bankName",
      render: (rowData) => <span>{rowData?.bankName}</span>,
    },
      {
      title: "Account No",
      align: "left",
      val: "accountNo",
      render: (rowData) => <span>{rowData?.accountNo}</span>,
    },
      {
      title: "IFSC Code",
      align: "left",
      val: "ifscCode",
      render: (rowData) => <span>{rowData?.ifscCode}</span>,
    },
   
   
    {
      title: "Email",
      align: "left",
      val: "emailId",
      render: (rowData) => <span>{rowData?.emailId}</span>,
    },
    {
      title: "Contact Person",
      align: "left",
      val: "contactPerson",
      render: (rowData) => <span>{rowData?.contactPerson}</span>,
    },

 

    {
      title: "Edit",
      align: "center",
      render: (rowData) => (
        <span
          style={{ cursor: "pointer", color: "blue", marginRight: 10 }}
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
          onClick={showFormHandler(rowData, actions[2])}
        >
          <FaIcons.FaTrash />
        </span>
      ),
    },
  ];
};

export default ManageVendorBankAccountsTable;
