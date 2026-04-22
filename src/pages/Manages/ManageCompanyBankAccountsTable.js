import React from "react";
import * as FaIcons from "react-icons/fa";

const ManageCompanyBankAccountsTable = ({showFormHandler, actions}) => {
  return [
    {
      title: "Company Name",
      align: "left",
      val: "companyName",
      render: (rowData) => <span>{rowData?.companyName}</span>,
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
          onClick={showFormHandler(rowData, actions[1])}
        >
          <FaIcons.FaTrash />
        </span>
      ),
    },
  ];
};

export default ManageCompanyBankAccountsTable;
