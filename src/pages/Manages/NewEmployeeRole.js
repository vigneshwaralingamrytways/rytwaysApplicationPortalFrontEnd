import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";


export default function NewEmployeeRole({
  selectedItem,
  onCancel,
  saveEmployeeRole,
  template,
  validate
}) {
  return (
   <div className={classes.container}>
            <Popupcard
                title="Add Employee Role " 
                showBack onBack={onCancel}


            >
      <CreateForm
        template={template}
        rowwise={3}
        defaultValues={selectedItem}
        onSubmit={saveEmployeeRole}
        onCancel={onCancel}
        buttonName="Save"
        validate={validate}
      />
     </Popupcard>
    </div>
  );
}
