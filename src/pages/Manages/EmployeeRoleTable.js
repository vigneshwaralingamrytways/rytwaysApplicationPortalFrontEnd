import React from "react";
import * as FaIcons from "react-icons/fa";

const EmployeeRoleTable = (showFormHandler, actions) => {
  return [
    
    {
      title: " Role Name",
      align: "left",
      val: "roleName",
      render: (rowData) => <span>{rowData?.roleName}</span>,
    },
    
    {
      title: "Description",
      align: "left",
      val: "roleDescription",
      render: (rowData) => <span>{rowData?.roleDescription}</span>,
    },
    // {
    //   title: "Status",
    //   align: "left",
    //   val: "Status",
    //   render: (rowData) => <span>{rowData?.Status}</span>,
    // },
    {
      title: "edit",
      align: "center",
      render: (rowData) => (
        <>
          <span
            style={{ cursor: "pointer", color: "blue",  }}
            onClick={showFormHandler(rowData, actions[0])}
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
            onClick={showFormHandler(rowData, actions[1])}
          >
            <FaIcons.FaTrash />
          </span>
        </>
      ),
    },
  ];
};

export default EmployeeRoleTable;
