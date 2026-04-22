import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";

export default function NewSupplier({ selectedItem, template, onCancel, saveSupplier }) {

  const validate = () => {

  }

  return (
    <div className={classes.container}>
      <Popupcard title="Add Supplier" onBack={onCancel}
      >
        <CreateForm
          template={template}
          rowwise={3}
          defaultValues={selectedItem}
          onSubmit={async (values) => {
            await saveSupplier(values);
            // onCancel();
          }}
          onCancel={onCancel}
          validate={validate}
          buttonName="Save"
        />
      </Popupcard>
    </div>
  );
}
