import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";

export default function NewCustomer({ selectedItem, template, onCancel, saveCustomer }) {
 const validate = () => true;
  return (
    <div className={classes.container}>
      <Popupcard title="Add Customer" showBack onBack={onCancel}
      >
        <CreateForm
          template={template}
          rowwise={4}
          defaultValues={selectedItem}
          onSubmit={saveCustomer}
          onCancel={onCancel}
          validate={validate}
          buttonName="Save"
        />
      </Popupcard>
    </div>
  );
}
