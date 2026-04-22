import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from 'react-icons/fa'

const UploadTable = (showFormHandler,actions) => {
  return [
   
  
      {
        title: "Document Name",
        align: 'left',
       
        render: rowData => {
          return <span>{rowData.fileName}</span>;
        },
      },
       {
        title: "Discription",
        align: 'left',
       
        render: rowData => {
          return <span>{rowData.remarks}</span>;
        },
      },
     
      {
        title: "View",
        align: 'center',
        render: rowData => { 
          return  <FaIcons.FaEye style={{cursor:"pointer"}} onClick={showFormHandler(rowData,"view")}></FaIcons.FaEye>
        },
      },
      {
        title: "Delete",
        align: 'center',
        render: rowData => { 
          return  <FaIcons.FaTrashAlt style={{cursor:"pointer"}} onClick={showFormHandler(rowData,"delete")}></FaIcons.FaTrashAlt>
        },
      },
     
     
     ];
};



export default UploadTable;
