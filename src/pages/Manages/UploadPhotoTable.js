import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaIcons from 'react-icons/fa'

const UploadPhotoTable = (showFormHandler,actions) => {
  return [
   
  
      {
        title: "Doucument  ",
        align: 'left',
       
        render: rowData => {
          return <span>{rowData.date}</span>;
        },
      },
        {
        title: "Doucument  Desc ",
        align: 'left',
       
        render: rowData => {
          return <span>{rowData.date}</span>;
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
          return  <FaIcons.FaTrashAlt style={{cursor:"pointer"}} onClick={showFormHandler(rowData,"Delete")}></FaIcons.FaTrashAlt>
        },
      },
     
     
     ];
};



export default UploadPhotoTable;
