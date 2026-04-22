import React from "react";
import * as FaIcons from "react-icons/fa";

const AssignSalaryStructureTable = ({ showFormHandler, salaryDefine }) => {
  return [

    {
      title: "Employee Name",
      align: "left",
      val: "employeeName",
      render: (rowData) => <span>{rowData?.employeeName}</span>,
    },
    {
      title: "Employee Role",
      align: "left",
      val: "roleName",
      render: (rowData) => <span>{rowData?.role?.roleName}</span>,
    },
    // {
    //   title: "Component Type",
    //   align: "left",
    //   val: "componentType",
    //   render: (rowData) => <span>{rowData?.componentType}</span>,
    // },
    //  {
    //   title: "Component Name",
    //   align: "left",
    //   val: "componentName",
    //   render: (rowData) => <span>{rowData?.componentName}</span>,
    // },
    // {
    //   title: "Component Value",
    //   align: "left",
    //   val: "componentValue",
    //   render: (rowData) => <span>{rowData?.componentValue}</span>,
    // },
    {
      title: "Assign",
      align: "center",
      render: (rowData) => {
        const isRoleDefined = salaryDefine?.some(
          (def) => Number(def.empRoleId) === Number(rowData?.empRoleId)
        );
        const isAlreadyAssigned = rowData?.isAssignedSalary;
        if (isRoleDefined || isAlreadyAssigned) {
          return (
            <FaIcons.FaPlug
              onClick={showFormHandler(rowData, "Assign")}
            />
          )
        }
        return null;
      }

      
    },

    // //  {
    // //       title: "Edit",
    // //       align: "center",
    // //       render: (rowData) => (
    // //         <span
    // //           style={{
    // //             cursor: "pointer",
    // //             color: "blue",
    // //           }}
    // //           onClick={showFormHandler(rowData, actions[0])}
    // //         >
    //           <FaIcons.FaEdit />
    //         </span>
    //       ),
    //     },

  ];
};

export default AssignSalaryStructureTable;