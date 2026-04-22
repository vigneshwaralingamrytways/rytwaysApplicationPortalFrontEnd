import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from 'react-icons/fa'

const UploadBankStatementsTable = (showFormHandler,actions) => {
  return [
   
  
      {
        title: "Bank Statement ",
        align: 'left',
       
        render: rowData => {
          return <span>{rowData.date}</span>;
        },
      },
       {
        title: "Month ",
        align: 'left',
       
        render: rowData => {
          return <span>{rowData.month}</span>;
        },
      },
      {
        title: "year ",
        align: 'left',
       
        render: rowData => {
          return <span>{rowData.year}</span>;
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
          return  <FaIcons.FaTrashAlt style={{cursor:"pointer"}} onClick={showFormHandler(rowData,"print")}></FaIcons.FaTrashAlt>
        },
      },
     
     
     ];
};



export default UploadBankStatementsTable;
