import React from "react";
import * as FaIcons from "react-icons/fa";

const DocumentsTable = (showFormHandler, actions) => {
  return [
   
      {
      title: "Documents Type",
      align: "left",
      val: "docType",
      render: (rowData) => <span>{rowData?.documentType}</span>,
    },
     {
      title: "Documents Title",
      align: "left",
      val: "docTitle",
      render: (rowData) => <span>{rowData?.documentTitle}</span>,
    },
    {
      title: "Paragraph",
      align: "center",
      render: (rowData) => (
        <>
         
          <span
            style={{ cursor: "pointer", color: "red" }}
            onClick={showFormHandler(rowData, actions[4])}
          >
            <FaIcons.FaUndo />
          </span>
        </>
      ),
    },
   {
      title: "Feilds",
      align: "center",
      render: (rowData) => (
        <>
         
          <span
            style={{ cursor: "pointer", color: "red" }}
            onClick={showFormHandler(rowData, actions[3])}
          >
            <FaIcons.FaUndo />
          </span>
        </>
      ),
    },
    {
      title: "Generate Documents",
      align: "center",
      render: (rowData) => (
        <>
         
          <span
            style={{ cursor: "pointer", color: "red" }}
            onClick={showFormHandler(rowData, actions[5])}
          >
            <FaIcons.FaEye />
          </span>
        </>
      ),
    },
    
    // {
    //   title: "edit",
    //   align: "center",
    //   render: (rowData) => (
    //     <>
    //       <span
    //         style={{ cursor: "pointer", color: "blue",  }}
    //         onClick={showFormHandler(rowData, actions[0])}
    //       >
    //         <FaIcons.FaEdit />
    //       </span>
         
    //     </>
    //   ),
    // },
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

export default DocumentsTable;
