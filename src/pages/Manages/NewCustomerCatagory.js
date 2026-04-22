import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";

const NewCustomerCatagory = ({
  selectedItem,
  savecustomerCatagory,
  onCancel,
  template,
  validate,
}) => {
  return (
    <div className={classes.container}>
      <Popupcard title="Add Customer Category" showBack onBack={onCancel}
>
        <CreateForm
          template={template}
          defaultValues={selectedItem}
          onSubmit={savecustomerCatagory}
          onCancel={onCancel}
          buttonName="Save"
          validate={validate}
          rowwise={2}
        />
      </Popupcard>
    </div>
  );
};

export default NewCustomerCatagory;
