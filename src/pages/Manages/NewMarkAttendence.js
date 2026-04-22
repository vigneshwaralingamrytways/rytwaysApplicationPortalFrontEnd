import React from "react";
import { CreateForm,Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";

export default function NewMarkAttendence({ selectedItem, onCancel,  saveattendenceType, template ,validate }) {
 
 
 
 
  return (

      <div className={classes.container}>

          <Popupcard
                title="Mark Attendence " 

            >
    <CreateForm
      template={template}
      rowwise={3}
      defaultValues={selectedItem}
      onSubmit={saveattendenceType}
      onCancel={onCancel}
      buttonName="Save"
      validate={validate}
    />
    </Popupcard>
    </div>
  );
}
