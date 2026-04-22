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
        return <span>{rowData.fileName}</span>;
      },
    }, {
      title: 'Description',
      align:'left',
      //val:"projectName",
      render: rowData => {
        return <span>{rowData.remarks}</span>;
      },
    },

    {
      title: 'Download',
      align:'center',
      render: rowData => {
        return <FaIcons.FaDownload style={{cursor:"pointer"}} onClick={showFormHandler(rowData,"view")}>
        </FaIcons.FaDownload>
    
      },
    },  
    {
      title: 'Delete',
      align:'center',
      render: rowData => {
          return  <FaIcons.FaTrashAlt  onClick={showFormHandler(rowData,"delete")} style={{ marginLeft: '5px',cursor:"pointer"}}>
          </FaIcons.FaTrashAlt>
      },
    },
      
    ];
  };
  
  export default FileUploadTable;