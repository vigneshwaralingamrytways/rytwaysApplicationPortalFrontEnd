import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';


const ApprovalTable = (showFormHandler,userId,roleId,department) => {
  return [
    {
      title: 'Action',
      align: 'center',
      render: rowData => {
        
        return (
        <> {
        <span>{rowData.authoriy.approvalName} </span>}</> 
          ); 
      },
    },
    {
      title: 'Action Performed On',
      align: 'center',
      render: rowData => {
        return (
          <> {rowData.isApproved==1 || rowData.isCancelled==1 ? 
          <span>{rowData.updatedOn} </span> : <> Yet To Perform Action</>}</> 
            ); 
      },
    },
    {
      title: 'Action By',
      align: 'center',
      render: rowData => {
        return (

          <> {rowData.isApproved==1 || rowData.isCancelled==1 ? 
            <span>{rowData.approvalPerson.personName} </span> : <> Yet To Perform Action</>}</> 
        )
      },
    },
    {
      title: 'Status',
      align: 'center',
      render: rowData => {       
        return (
          <> {rowData.isApproved==1  && rowData.isCancelled==0? 
          <span>{rowData.authoriy.approvalName} </span> : 
            rowData.isCancelled==1 ? <>Cancelled </>: 
            rowData.showApproval ==1 ? 
            rowData.authoriy.approvalType =="Role Wise" ?  
            rowData.authoriy.isDepartmentSpecific =="Yes" ?  
            department.split(',').includes(`${rowData.departmentId}`) ? 
            roleId == rowData.authoriy.roleId ? 
            <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            : rowData.authoriy.secondaryStatus =="Yes" & userId==rowData.authoriy.secondaryUserId? 
            <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            :<>Yet to Take Action</>
            :rowData.authoriy.secondaryStatus =="Yes" & userId==rowData.authoriy.secondaryUserId? 
            <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            :<>Yet to Take Action</>
            :roleId == rowData.roleId ? 
            <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            :rowData.authoriy.secondaryStatus =="Yes" & userId==rowData.authoriy.secondaryUserId? 
            <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            :<>Yet to Take Action</>
            :userId == rowData.authoriy.userId ?  <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            :rowData.authoriy.secondaryStatus =="Yes" & userId==rowData.authoriy.secondaryUserId? 
            <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            :<>Yet to Take Action</>
            :<>Yet to Take Action</>
      }</> 
            ); 
        
      },
    },
    {
        title: 'Remarks',
        align: 'center',
        render: rowData => {
          return <span>{rowData.approverRemarks}</span>; 
        },
      }
  ];
};



export default ApprovalTable;
