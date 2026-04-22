import React from 'react';
import * as BsIcons from 'react-icons/bs'
import * as FaIcons from 'react-icons/fa'
import { ImCross } from "react-icons/im"
import {AiOutlinePullRequest,AiOutlineReconciliation} from 'react-icons/ai'

// This is the table constant/settings which needed to render table elements

export const ProcessQueryTable = (showFormHandler,actions) => {
  return [
    {
      title: 'Comment Type',
      align:'center',
      render: rowData => {
        return (
        <>
        <span>{rowData.commentType}</span></>
        )
      },
    },
   {
      title: 'Comments',
      align:'center',
      render: rowData => {
        return <span>{rowData.issueComments}</span>;
      },
    },
    
    
  ];
};


export default ProcessQueryTable
