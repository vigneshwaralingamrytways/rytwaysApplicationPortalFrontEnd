import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";


export default function NewExpenseCat({
  selectedItem,
  onCancel,
  saveExpenseCat,
  template,
  validate
}) {
    
  return (
   <div className={classes.container}>
            <Popupcard
                title="Add Expense Catagory" 
                showBack onBack={onCancel}


            >
      <CreateForm
        template={template}
        rowwise={3}
        defaultValues={selectedItem}
        onSubmit={saveExpenseCat}
        onCancel={onCancel}
        buttonName="Save"
        validate={validate}
      />
     </Popupcard>
    </div>
  );
}
