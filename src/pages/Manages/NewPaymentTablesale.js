import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";


export default function NewPaymentTableSale({
  selectedItem,
  onCancel,
  savepayment,
  template,
  validate
}) {
  return (
   <div className={classes.container}>
            <Popupcard
                title="View Payments" 

            >
      <CreateForm
        template={template}
        rowwise={3}
        defaultValues={selectedItem}
        onSubmit={savepayment}
        onCancel={onCancel}
        buttonName="Save"
        validate={validate}
      />

      
     </Popupcard>
    </div>
  );
}
