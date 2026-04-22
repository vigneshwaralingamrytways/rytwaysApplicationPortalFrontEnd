import React from 'react';
import * as BsIcons from 'react-icons/bs'
import * as FaIcons from 'react-icons/fa'
import {AiOutlinePullRequest,AiOutlineReconciliation} from 'react-icons/ai'

// This is the table constant/settings which needed to render table elements

export const MaterialItemTable= (showFormHandler,actions) => {
  // console.log(showFormHandler,actions,"showFormHandler,actions")
  return [
   
    {
        title: 'Item Name',
        align:'center',
        //val:"vehicel number",
        render: rowData => { 
          return <span>{rowData.materialName}</span>;
  
       } },

    {
        title: 'Quantity',
        align:'center',
        //val:"vehicel number",
        render: rowData => { 
          return <span>{rowData.qty}</span>;
  
       } }, {
        title: 'Uom',
        align:'center',
        //val:"vehicel number",
        render: rowData => { 
          return <span>{rowData.uom}</span>;
  
       } },
       {
        title: 'Edit',
        align:'center',
        render: rowData => {
          return <FaIcons.FaEdit style={{cursor:"pointer"}} onClick={showFormHandler(rowData,"Edit")}></FaIcons.FaEdit>
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


export default MaterialItemTable;

