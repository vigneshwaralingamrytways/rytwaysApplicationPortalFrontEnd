import React from "react";
import * as FaIcons from "react-icons/fa";

const DefineSalaryStructureTable = ({showFormHandler, actions}) => {
  return [
    {
      title: "Employee Role",
      align: "left",
      val: "roleName",
      render: (rowData) => <span>{rowData?.roleName}</span>,
    },
     {
          title: "Define",
          align: "center",
          render: (rowData) => (
            <span
              style={{
                cursor: "pointer",
                color: "blue",
              }}
              onClick={showFormHandler(rowData, actions[3])}
            >
              <FaIcons.FaPlug/>
            </span>
          ),
        },
    

    //  {
    //       title: "Edit",
    //       align: "center",
    //       render: (rowData) => (
    //         <span
    //           style={{
    //             cursor: "pointer",
    //             color: "blue",
    //           }}
    //           onClick={showFormHandler(rowData, actions[0])}
    //         >
    //           <FaIcons.FaEdit />
    //         </span>
    //       ),
    //     },
    
  ];
};

export default DefineSalaryStructureTable;