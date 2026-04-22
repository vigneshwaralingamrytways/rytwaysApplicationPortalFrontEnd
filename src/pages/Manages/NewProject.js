import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";


export default function NewProject({
  selectedItem,
  onCancel,
  saveProject,
  template,
  validate
}) {
  return (
   <div className={classes.container}>
            <Popupcard
                title="Add project" 
                showBack onBack={onCancel}


            >
      <CreateForm
        template={template}
        rowwise={3}
        defaultValues={selectedItem}
        onSubmit={saveProject}
        onCancel={onCancel}
        buttonName="Save"
        validate={validate}
      />

     </Popupcard>
    </div>
  );
}
