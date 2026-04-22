import React from "react";
import * as FaIcons from "react-icons/fa";

const SalaryUpgradeTable = ({ showFormHandler, getActions }) => {
  return [

    {
      title: "Employee Name",
      align: "left",
      val: "employeeName",
      render: (rowData) => <span>{rowData?.employeeName}</span>,
    },
    {
      title: "Employee Code",
      align: "left",
      val: "employeeCode",
      render: (rowData) => <span>{rowData?.employeeCode}</span>,
    },

    {
      title: "Employee Email",
      align: "left",
      val: "email",
      render: (rowData) => <span>{rowData?.email}</span>,
    },
    {
      title: "Employee Role",
      align: "left",
      val: "roleName",
      render: (rowData) => <span>{rowData?.roleName}</span>,
    },

    // {
    //   title: "Month",
    //   align: "left",
    //   val: "month",
    //   render: (rowData) => <span>{rowData?.month}</span>,
    // },

    {
      title: "UpDate",
      align: "center",
      render: (rowData) =>
        rowData.isAssignedSalary ? (
          <FaIcons.FaDollarSign
            onClick={showFormHandler(rowData, "Update")}
          />
        ) : null

    },

  ];
};

export default SalaryUpgradeTable;