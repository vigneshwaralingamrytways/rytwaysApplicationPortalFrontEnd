import React from 'react';
import * as BsIcons from 'react-icons/bs'
import * as FaIcons from 'react-icons/fa'
import { ImCross } from "react-icons/im"
import {AiOutlinePullRequest,AiOutlineReconciliation} from 'react-icons/ai'

// This is the table constant/settings which needed to render table elements

export const ActivityReviewTable = (showFormHandler,actions) => {
  return [

   {
      title: 'Comments',
      align:'center',
      render: rowData => {
        return <span>{rowData.commentName}</span>;
      },
    },{
      title: 'Status',
      align:'center',
      render: rowData => {
        return <span>{rowData.commentStatus}</span>;
      },
    }
    
  ];
};


export default ActivityReviewTable

