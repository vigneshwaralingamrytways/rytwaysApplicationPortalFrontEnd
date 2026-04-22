import React from 'react';
import * as BsIcons from 'react-icons/bs'
import * as FaIcons from 'react-icons/fa'
import {AiOutlinePullRequest,AiOutlineReconciliation} from 'react-icons/ai'
import {FaDailymotion} from 'react-icons/fa'
// This is the table constant/settings which needed to render table elements

export const FileUploadTable = (showFormHandler,actions) => {
  return [
    {
      title: 'Document Name',
      align:'left',
      //val:"projectName",
      render: rowData => {
        return <span>{rowData.documentname}</span>;
      },
    },
      {
        title: 'View',
        align: 'center',
        render: (rowData) => {
          return  <FaIcons.FaEye  onClick={showFormHandler(rowData,actions[1])} style={{ marginLeft: '5px', }}>
</FaIcons.FaEye>
            
          
        },
      },
      {
        title: 'Delete',
        align: 'center',
        render: (rowData) => {
          return  <FaIcons.FaTrash  onClick={showFormHandler(rowData,actions[1])} style={{ marginLeft: '5px', }}>
</FaIcons.FaTrash>
            
          
        },
      },
      
    ];
  };
  
  export default FileUploadTable;