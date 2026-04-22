import React from 'react';
import * as BsIcons from 'react-icons/bs'
import * as FaIcons from 'react-icons/fa'
import { BsActivity } from "react-icons/bs";

import {AiOutlinePullRequest,AiOutlineReconciliation} from 'react-icons/ai'

// This is the table constant/settings which needed to render table elements

export const CustomerTable = (showFormHandler,actions) => {
  return [
    {
      title: 'User Name',
      align:'center',
      render: rowData => {
        return <span>{rowData.userName}</span>;
      
      },
    }, {
      title: 'Full Name',
      align:'center',
      render: rowData => {
        return <span>{rowData.personName}</span>;
      
      },
    },{
      title: 'Phone No',
      align:'center',
      render: rowData => {
        return <span>{rowData.phoneNo}</span>;
      },
    }, {
      title: 'Customer Email',
      align:'center',
      render: rowData => {
        return <span>{rowData.email}</span>;
      },
    },
    /* {
      title: 'Department',
      align:'center',
      render: rowData => {
        return <span>{rowData.departmentId}</span>;
      },
    }, */
    {
      title: 'Department',
      align:'left',
      render: rowData => {
        return <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData,actions[2])}>{rowData.departmentId ? rowData.departmentId : ""}</span>;
      },
    },{
      title: 'Activity',
      align:'center',
      render: rowData => {
        return <FaIcons.FaRoute  style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData,actions[4])}>{rowData.departmentId ? rowData.departmentId : ""}</FaIcons.FaRoute >;
      },
    },{
      title: 'Role',
      align:'center',
      render: rowData => {
        return <span>{rowData?.role?.roleName}</span>;
      },
    },
      {
        title: 'Edit',
        align:'center',
        render: rowData => {
          return <FaIcons.FaEdit style={{cursor:"pointer"}} onClick={showFormHandler(rowData,actions[0])}></FaIcons.FaEdit>
        },
      },{
        title: 'Delete',
        align:'center',
        render: rowData => {
          return <FaIcons.FaTrashAlt style={{cursor:"pointer"}} onClick={showFormHandler(rowData,actions[3])}></FaIcons.FaTrashAlt>
        },
      }
  ];
};


export default CustomerTable