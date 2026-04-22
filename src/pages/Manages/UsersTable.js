import React from "react";
import * as FaIcons from "react-icons/fa";

const UsersTable = ({showFormHandler, actions}) => {
  return [
    {
      title: "Employee Name",
      align: "left",
      val: "employeeName",
      render: (rowData) => <span>{rowData?.employeeName}</span>,
    },
    {
      title: "Mobile No",
      align: "left",
      val: "mobileNo",
      render: (rowData) => <span>{rowData?.mobileNo}</span>,
    },
    {
      title: "Email ID",
      align: "left",
      val: "officialEmailId",
      render: (rowData) => <span>{rowData?.officialEmailId}</span>,
    },
    {
      title: "Designation",
      align: "left",
      val: "designation",
      render: (rowData) => <span>{rowData?.designation}</span>,
    },
    {
      title: "Department",
      align: "left",
      val: "departmentId",
      render: (rowData) => <span>{rowData?.department?.departmentName}</span>,
    },



    // {
    //   title: "Upload",
    //   align: "center",
    //   render: (rowData) => (
    //     <span
    //       style={{
    //         cursor: "pointer",
    //         color: "blue",
    //       }}
    //       onClick={showFormHandler(rowData, actions[2])}
    //     >
    //       <FaIcons.FaUpload />
    //     </span>
    //   ),
    // },
    // {
    //   title: "Print",
    //   align: "center",
    //   render: (rowData) => (
    //     <span
    //       style={{
    //         cursor: "pointer",
    //         // color: "green",
    //       }}
    //       onClick={showFormHandler(rowData, actions[4])}
    //     >
    //       <FaIcons.FaPrint />
    //     </span>
    //   ),
    // },
    {
      title: "Edit",
      align: "center",
      render: (rowData) => (
        <span
          style={{
            cursor: "pointer",
            // color: "green",
          }}
          onClick={showFormHandler(rowData, actions[0])}
        >
          <FaIcons.FaEdit />
        </span>
      ),
    },

    
    // {
    //   title: "Delete",
    //   align: "center",
    //   render: (rowData) => (
    //     <span
    //       style={{ cursor: "pointer", color: "red" }}
    //       onClick={showFormHandler(rowData, actions[1])}
    //     >
    //       <FaIcons.FaTrash />
    //     </span>
    //   ),
    // },
  ];
};

export default UsersTable;