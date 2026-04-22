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

export const RoleTable = (showFormHandler,actions) => {
  
  return [
   {
      title: 'User',
      align:'center',
      render: rowData => {
        return <span>{rowData?.user?.personName || ''}</span>;
      
      },
    },
    /* {
      title: 'Active',
      align:'center',
      render: rowData => {
        return <span>{rowData.active}</span>;
      
      },
    }, */
    /* {
        title: 'Access',
        align:'center',
        render: rowData => {
          return <span>{rowData.accesRight}</span>;
        
        },
      },{
        title: 'Delete',
        align: 'center',
        render: (rowData) => {
          return  <FaIcons.FaTrash  onClick={showFormHandler(rowData,actions[0])} style={{ marginLeft: '5px',cursor:"pointer" }}>
</FaIcons.FaTrash>
            
          
        },
      },
       */
   
  ]
};

export default RoleTable ;
