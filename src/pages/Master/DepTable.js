import React from 'react';
import * as BsIcons from 'react-icons/bs'
import * as FaIcons from 'react-icons/fa'
import {AiOutlinePullRequest,AiOutlineReconciliation} from 'react-icons/ai'

// This is the table constant/settings which needed to render table elements

export const DepTable = (showFormHandler,actions) => {
  return [
    {
      title: 'Department Name',
      align:'left',
      render: rowData => {
        return <span>{rowData.departmentName}</span>;
      
      },
    },
    {
      title: 'Department Head',
      align:'left',
      render: rowData => {
      return <span>{rowData.departmentHead}</span>;
      
      },
    },
    {
      title: 'Ass Department Head',
      align:'left',
      render: rowData => {
        return <span>{rowData.assDepartmentHead}</span>;
      
      },
    },
      {
        title: 'Edit',
        align:'center',
        render: rowData => {
          return <FaIcons.FaEdit style={{cursor:"pointer"}} onClick={showFormHandler(rowData,actions[0])}></FaIcons.FaEdit>
        },
      }
  ];
};


export default DepTable/*  */
