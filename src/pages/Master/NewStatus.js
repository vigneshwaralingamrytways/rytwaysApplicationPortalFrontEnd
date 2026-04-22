import React from "react";
import { CreateForm,Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from './Master.module.css'; 

export default function NewStatus({ selectedItem, onCancel, savestatus, template,validate }) {
 
 
 
 
  return (

      <div className={classes.container}>

          <Popupcard
                title="Add Status" 
                showBack onBack={onCancel}

            >
    <CreateForm
      template={template}
      rowwise={3}
      defaultValues={selectedItem}
      onSubmit={savestatus}
      onCancel={onCancel}
      buttonName="Save"
      validate={validate}
    />
    </Popupcard>
    </div>
  );
}
