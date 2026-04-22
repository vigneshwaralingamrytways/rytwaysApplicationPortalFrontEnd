import React from 'react';
import * as BsIcons from 'react-icons/bs'
import * as FaIcons from 'react-icons/fa'
import {AiOutlinePullRequest,AiOutlineReconciliation} from 'react-icons/ai'
import { Button } from 'react-bootstrap';

// This is the table constant/settings which needed to render table elements

export const ApprovalTable= (showFormHandler,actions) => {
  // console.log(showFormHandler,actions,"showFormHandler,actions")
  return [
    {
      title: 'approved By',
      align:'center',
      //val:"vehicel number",
      render: rowData => { 
        return      <span>{rowData.approvedby}</span>;

     } },
     
     {
      title: 'Approved On',
      align:'center',
      //val:"vehicel number",
      render: rowData => { 
        return      <span>{rowData.approvedon}</span>;

     } },
   
   
    // {
    //   title: 'Vehicel Number',
    //   align:'center',
    //   //val:"vehicel number",
    //   render: rowData => { 
    //     return      <span>{rowData.vehicelnumber}</span>;

    //  } }, 
     {
      title: 'Remark',
      align:'center',
      //val:"vehicel number",
      render: rowData => { 
        return      <span>{rowData.remark}</span>;

     } }, 
     
       
     
      {
        title: 'Edit',
        align:'center',
        render: rowData => {
          return <FaIcons.FaEdit style={{cursor:"pointer"}} onClick={showFormHandler(rowData,actions[0])}></FaIcons.FaEdit>
        },
      },
      
  ];
};


export default ApprovalTable

