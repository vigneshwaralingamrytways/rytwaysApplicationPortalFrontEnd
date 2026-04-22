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

export const ActWizTable = (showFormHandler, actions) => {
  
  return [
   {
      title: 'Activity Name',
      align:'center',
      render: rowData => {
        return <span>{rowData.activityName}</span>;
      
      },
    },{
      title: 'Edit',
      align:'center',
      render: rowData => {
        return  <FaIcons.FaEdit  onClick={showFormHandler(rowData,actions[0])} style={{ marginLeft: '5px',cursor:"pointer" }}>
        </FaIcons.FaEdit>
    },
    },{
      title: 'Delete',
      align: 'center',
      render: (rowData) => {
        return  <FaIcons.FaTrash  onClick={showFormHandler(rowData,actions[2])} style={{ marginLeft: '5px',cursor:"pointer" }}>
</FaIcons.FaTrash>
          
        
      },
    }
   
  ]
};

export default ActWizTable ;

