import React from "react";
import * as FaIcons from "react-icons/fa";

const CustomerCatagoryTable = (handleEditCategory, deletecustomerCatagory) => {
  return [
    {
      title: "Customer Catagory",
      align: "left",
      val: "customerCatagory",
      render: (rowData) => <span>{rowData?.customerCatagory}</span>,
    },
    {
      title: "Description",
      align: "left",
      val: "description",
      render: (rowData) => <span>{rowData?.description}</span>,
    },
    {
      title: "edit",
      align: "center",
      render: (rowData) => (
        <>
          <span
            style={{ cursor: "pointer", color: "blue", }}
            onClick={handleEditCategory(rowData)}
          >
            <FaIcons.FaEdit />
          </span>

        </>
      ),
    },
    {
      title: "delete",
      align: "center",
      render: (rowData) => (
        <>

          <span
            style={{ cursor: "pointer", color: "red" }}
           onClick={() => deletecustomerCatagory(rowData.customerCatagoryId)}
          >
            <FaIcons.FaTrash />
          </span>
        </>
      ),
    },
  ];
};

export default CustomerCatagoryTable;
