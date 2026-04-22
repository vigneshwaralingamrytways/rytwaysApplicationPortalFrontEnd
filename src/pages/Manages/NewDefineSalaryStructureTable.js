import React from "react";
import * as FaIcons from "react-icons/fa";

const NewDefineSalaryStructureTable = ({showFormHandler, actions}) => {
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
      val: "componentValue",
      render: (rowData) => <span>{rowData?.componentValue}</span>,
    },
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

export default NewDefineSalaryStructureTable;