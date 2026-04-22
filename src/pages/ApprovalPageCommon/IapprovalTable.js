import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import { format, differenceInMilliseconds  } from 'date-fns';

const IapprovalTable = (showFormHandler,userId,roleId,department) => {
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
        const formatedupdatedOn = rowData.updatedOn ? format(new Date(rowData.updatedOn), 'dd/MM/yyyy, h:mm a') : "N/A";
   
        return (
          <> {rowData.isApproved==1 || rowData.isCancelled==1 ? 
          <span>{formatedupdatedOn} </span> : <> Yet To Perform Action</>}</> 
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
          <span>{rowData.authoriy.approvalStatusName} </span> : 
            rowData.isCancelled==1 ? <>Cancelled </>: 
            rowData.showApproval ==1 ? 
            rowData.authoriy.approvalType =="Role Wise" ?  
            rowData.authoriy.isDepartmentSpecific =="Yes" ?  
            department.split(',').includes(`${rowData.departmentId}`) ? 
            rowData.authoriy.roleId.toString().split(",").includes(roleId) ? 
            <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            : rowData.authoriy.secondaryStatus =="Yes" & rowData.authoriy.secondaryUserId.split(",").includes(userId)? 
            <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            :<>Yet to Take Action</>
            :rowData.authoriy.secondaryStatus =="Yes" & rowData.authoriy.secondaryUserId.split(",").includes(userId)? 
            <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            :<>Yet to Take Action</>
            :rowData.authoriy.roleId.split(",").includes(roleId) ? 
            <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            :rowData.authoriy.secondaryStatus =="Yes" & rowData.authoriy.secondaryUserId.split(",").includes(userId)? 
            <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            :<>Yet to Take Action</>
            :rowData.authoriy.userId.split(",").includes(userId) ?  <span style={{cursor:"pointer",color:"blue"}} onClick={showFormHandler(rowData)}>Approve</span> 
            :rowData.authoriy.secondaryStatus =="Yes" & rowData.authoriy.secondaryUserId.split(",").includes(userId)? 
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



export default IapprovalTable;
