import React from 'react';
import * as FaIcons from 'react-icons/fa'
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  // InputGroup,
  // FormControl
} from "react-bootstrap";


// This is the table constant/settings which needed to render table elements

export const MenuTable = (showFormHandler, actions) => {
  
  return [
   {
      title: 'Activity Name',
      align:'center',
      render: rowData => {
        return <span>{rowData.activityName}</span>;
      
      },
    },{
        title: 'Describtion',
        align:'center',
        render: rowData => {
          return <span>{rowData.processName}</span>;
        
        },
      },
    {
      title: 'Role',
      align:'center',
      render: rowData => {
        return  <FaIcons.FaUser  onClick={showFormHandler(rowData,actions[2])} style={{ marginLeft: '5px',cursor:"pointer" }}>
        </FaIcons.FaUser>
    },
    },
   /*  {
      title: 'Form Config',
      align:'center',
      render: rowData => {
        return  <FaIcons.FaFileAlt  onClick={showFormHandler(rowData,actions[1])} style={{ marginLeft: '5px',cursor:"pointer" }}>
        </FaIcons.FaFileAlt>
    },
    },
    {
      title: 'User',
      align:'center',
      render: rowData => {
        return  <FaIcons.FaFileAlt  onClick={showFormHandler(rowData,actions[2])} style={{ marginLeft: '5px',cursor:"pointer" }}>
        </FaIcons.FaFileAlt>
    },
    },{
      title: 'Edit',
      align:'center',
      render: rowData => {
        return  <FaIcons.FaEdit  onClick={showFormHandler(rowData,actions[3])} style={{ marginLeft: '5px',cursor:"pointer" }}>
        </FaIcons.FaEdit>
    },
    },{
      title: 'Delete',
      align: 'center',
      render: (rowData) => {
        return  <FaIcons.FaTrash  onClick={showFormHandler(rowData,actions[4])} style={{ marginLeft: '5px',cursor:"pointer" }}>
</FaIcons.FaTrash>
          
        
      },
    }, */
    
   
  ]
};

export default MenuTable ;

