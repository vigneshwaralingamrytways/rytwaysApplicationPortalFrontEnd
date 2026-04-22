import React from "react";
import * as FaIcons from "react-icons/fa";

const NewSalaryUpdateTable= ({showFormHandler, actions, onValueChange,}) => {
  return [
    {
      title: "Component Type",
      align: "left",
      val: "componentType",
      render: (rowData) => <span>{rowData?.componentType}</span>,
    },
     {
      title: "Component Name",
      align: "left",
      val: "componentName",
      render: (rowData) => <span>{rowData?.componentName}</span>,
    },
    {
      title: "Component Value",
      align: "left",
      val: "componentValue",
       render: (rowData) => (
        <input
          type="number"
         value={rowData.currentComponentValue}
          
        onChange={e =>
          onValueChange(rowData.salaryAssignId, Number(e.target.value))
        }
        />
      ),
    },
     
       
  ];
};

export default NewSalaryUpdateTable;