import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";


export default function NewBankAccount({
  selectedItem,
  onCancel,
 
  template,
  validate,
  onSubmit
}) {
  return (
   <div className={classes.container}>
            <Popupcard
                title="Add Bank Account" 
                showBack onBack={onCancel}


            >
      <CreateForm
        template={template}
        rowwise={3}
        defaultValues={selectedItem}
        onSubmit={onSubmit}
        onCancel={onCancel}
        buttonName="Save"
        validate={validate}
      />

       
     </Popupcard>
    </div>
  );
}
