import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";

export default function NewVendorBankAccounts({ selectedItem,template, onCancel, saveBankAccount  }) {
  
  const validate=()=>{
    
  }

  return (
    <div className={classes.container}>
      <Popupcard title="Add Vendor Bank Accounts" showBack onBack={onCancel}
>
        <CreateForm
          template={template}
          rowwise={3}
          defaultValues={selectedItem}
          onSubmit={saveBankAccount}
          onCancel={onCancel}
            validate={validate}
          buttonName="Save"
        />
      </Popupcard>
    </div>
  );
}
