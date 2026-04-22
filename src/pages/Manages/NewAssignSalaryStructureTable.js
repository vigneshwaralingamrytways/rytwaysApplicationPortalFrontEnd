import React from "react";
import * as FaIcons from "react-icons/fa";

const NewAssignSalaryStructureTable = ({ showFormHandler, actions, onValueChange, }) => {
  return [
    {
      title: "Component Type",
      align: "left",
      val: "componentType",
      render: (rowData) => <span>{rowData?.componentType?.componentType}</span>,
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
      val: "currentComponentValue",
      render: (rowData) => {
        const displayVal = rowData?.currentComponentValue ?? rowData?.componentValue ?? rowData?.salaryDefine?.componentValue;
        return (
          <input
            type="text"
            value={displayVal ?? ""}
            onChange={(e) => onValueChange(rowData.salaryDefineId, e.target.value)}
          />
        );
      }

    },


  ];
};

export default NewAssignSalaryStructureTable;