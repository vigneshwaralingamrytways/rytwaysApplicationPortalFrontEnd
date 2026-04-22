import React from "react";
import CreateForm from "../../../Components/Forms/CreateForm";
import api from "../../../Api";
import {Card,Row,Col} from 'react-bootstrap'
import  classes from './customer.module.css'
import Popupcard from "../../../UI/cards/Popupcard";

const rowWiseFields = 3;


const form_header=<>
<Card body className={classes.title}>
  <Row>
  <Col md={{ span: 6, offset: 3 }}> <h4 style={{color: 'white'}}>User Form</h4> </Col> 
  </Row>
  </Card>
</>

function UserForm(props) {
  //console.log({...props.selectedItem})

  async function onSubmit(values) {
    props.customerSave({...values});
  }


  const template = {
    fields: [
      {
        title: "User Name",
        type: "text",
        name: "userName",
        contains: "text",
        inpprops: {
          minlength: 4,
          maxlength: 80,
        },
      },
      {
        title: "Full Name",
        type: "text",
        name: "personName",
        contains: "text",
        inpprops: {
          minlength: 4,
          maxlength: 80,
        },
      },
      {
        title: "Password",
        type: "text",
        name: "password",
        contains: "password",
        inpprops: {
          minlength: 8,
          maxlength: 80,
        },
      },{
        title: "Department",
        // type: "checkboxdropdown",
        type: "searchSingleSelect",
        name: "departmentId",
        contains:"searchSingleSelect",
        options: props.depart,
       /*  options: [
          { value: "Select", label: "Select" },
          { value: "Foundry", label: "Foundry" },
          { value: "Machine_Shop", label: "Machine_Shop" },
          { value: "Production", label: "Production" },
          { value: "GDC_Quality", label: "GDC_Quality" },
          { value: "Machining_Quality", label: "Machining_Quality" },
          { value: "Quality", label: "Quality" },
          { value: "Stores", label: "Stores" },
           { value: "Administration", label: "Administration" },
          { value: "HR", label: "HR" },
          { value: "IT", label: "IT" },
          { value: "Maintainence", label: "Maintainence" },
          { value: "OutSource", label: "OutSource" },
          {value: "Packing", label: "Packing" },
          { value: "NPD", label: "NPD" },
          { value: "ToolRoom", label: "ToolRoom" },
          { value: "Sand_Casting", label: "Sand_Casting" },
        ], */
      },
      {
        title: "Email",
        type: "text",
        name: "email",
        contains: "text",
        inpprops: {
          maxlength: 80,
        },
      },
      {
        title: "Mobile No",
        type: "text",
        name: "phoneNo",
        contains: "text",
        inpprops: {
          minlength: 10,
          maxlength: 80,
        },
      },
      {
        title: "Role",
        type: "select",
        name: "roleId",
        contains: "Select",
        options: props.roles,
      },
      {
        type: "hidden",
        name: "userId",
        contains: "text",
        inpprops: {
         
        },
      },
      
    ],
  };

  return (
    <>
     <Popupcard title="User Form">  
    <CreateForm
      template={template}
      rowwise={rowWiseFields}
      validate={validate}
      onSubmit={onSubmit}
      onCancel={props.onCancel}
      buttonName="Submit"
      defaultValues={props.selectedItem}
    ></CreateForm>
    </Popupcard>
    </>
  );
}

export default UserForm;



function validate(watchValues, errorMethods) {
  let { errors, setError, clearErrors } = errorMethods;

  // Firstname validation
  if (watchValues["firstname"] === "Admin") {
    if (!errors["firstname"]) {
      setError("firstname", {
        type: "manual",
        message: "You cannot use this first name",
      });
    }
  } else {
    if (errors["firstname"] && errors["firstname"]["type"] === "manual") {
      clearErrors("firstname");
    }
  }
}
