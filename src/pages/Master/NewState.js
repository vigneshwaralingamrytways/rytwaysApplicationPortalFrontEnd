import React from "react";
import { CreateForm,Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from './Master.module.css'; 

export default function NewState({ selectedItem, onCancel, savestate, template,validate }) {
 
 
 
 
  return (

      <div className={classes.container}>

          <Popupcard
                title="Add State" 
                showBack onBack={onCancel}

            >
    <CreateForm
      template={template}
      rowwise={3}
      defaultValues={selectedItem}
      onSubmit={savestate}
      onCancel={onCancel}
      buttonName="Save"
      validate={validate}
    />
    </Popupcard>
    </div>
  );
}
