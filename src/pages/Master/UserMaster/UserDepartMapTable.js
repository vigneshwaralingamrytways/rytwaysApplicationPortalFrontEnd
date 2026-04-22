import React from 'react';
import * as BsIcons from 'react-icons/bs'
import * as FaIcons from 'react-icons/fa'
import {AiOutlinePullRequest,AiOutlineReconciliation} from 'react-icons/ai'

// This is the table constant/settings which needed to render table elements

export const UserDepartMapTable = (showFormHandler,actions) => {
  return [
  /*   {
      title: 'User Name',
      align:'left',
      render: rowData => {
        return <span>{rowData?.user?.userName}</span>;
      
      },
    },  */
    {
      title: 'Department',
      align:'left',
      render: rowData => {
        return <span>{rowData.department ? rowData.department.departmentName : ""}</span>;
      },
    },
      {
        title: 'Delete',
        align:'center',
        render: rowData => {
          return <FaIcons.FaTrash style={{cursor:"pointer"}} onClick={showFormHandler(rowData,actions[0])}></FaIcons.FaTrash>
        },
      }
  ];
};


export default UserDepartMapTable
