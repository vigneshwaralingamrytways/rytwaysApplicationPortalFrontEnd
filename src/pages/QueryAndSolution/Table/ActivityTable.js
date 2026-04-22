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

export const ActivityTable = (showFormHandler, actions) => {
  
  return [
   {
      title: 'Activity Name',
      align:'center',
      render: rowData => {
        return <span>{rowData.activityName}</span>;
      
      },
    },{
      title: 'Role',
      align:'center',
      render: rowData => {
        return  <FaIcons.FaUser  onClick={showFormHandler(rowData,actions[1])} style={{ marginLeft: '5px',cursor:"pointer" }}>
        </FaIcons.FaUser>
    },
    },
   
  ]
};

export default ActivityTable ;

