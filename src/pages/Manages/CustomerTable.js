import React from "react";
import * as FaIcons from "react-icons/fa";

const CustomerTable = (handleEdit, handleDelete, state, country) => {
  return [
    {
      title: "Customer Name",
      align: "left",
      val: "customerName",
      render: (rowData) => <span>{rowData?.customerName}</span>,
    },
    {
      title: "State",
      align: "left",
      val: "stateName",
      render: (rowData) => <span>{rowData?.state?.stateName}</span>,
    },
    {
      title: "Country",
      align: "left",
      val: "countryName",
      render: (rowData) => <span>{rowData?.country?.countryName}</span>,
    },
    {
      title: "Contact No",
      align: "right",
      val: "contactNo",
      render: (rowData) => <span>{rowData?.contactNo}</span>,
    },
    {
      title: "Email",
      align: "left",
      val: "email",
      render: (rowData) => <span>{rowData?.email}</span>,
    },
    {
      title: "Contact Person",
      align: "left",
      val: "contactPerson",
      render: (rowData) => <span>{rowData?.contactPerson}</span>,
    },
    {
      title: "GST NO",
      align: "left",
      val: "gstNo",
      render: (rowData) => <span>{rowData?.gstNo}</span>,
    },
    // Actions Column - Edit
    {
      title: "Edit",
      align: "center",
      render: (rowData) => (
        <span
          style={{ 
            cursor: "pointer", 
            color: "#007bff", 
            marginRight: 10,
            fontSize: "18px"
          }}
          onClick={handleEdit(rowData)} // Direct call to handleEdit
          title="Edit Customer"
        >
          <FaIcons.FaEdit />
        </span>
      ),
    },
    // Actions Column - Delete
    {
      title: "Delete",
      align: "center",
      render: (rowData) => (
        <span
          style={{ 
            cursor: "pointer", 
            color: "#dc3545",
            fontSize: "18px"
          }}
          onClick={() => handleDelete(rowData.customerId)} // Direct call to handleDelete
          title="Delete Customer"
        >
          <FaIcons.FaTrash />
        </span>
      ),
    },
  ];
};

export default CustomerTable;
