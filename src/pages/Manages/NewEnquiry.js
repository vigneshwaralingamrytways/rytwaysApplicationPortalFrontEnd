import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";

export default function NewEnquiry({
  selectedItem,
  onCancel,
  saveEnquiry,
  template,
  validate
}) {
  return (
    <div className={classes.container}>
      <Popupcard title="Add Enquiry" showBack onBack={onCancel}
>
        <CreateForm
          template={template}
          rowwise={3}
          defaultValues={selectedItem}
          onSubmit={saveEnquiry}
          onCancel={onCancel}
          buttonName="Save"
          validate={validate}
        />
      </Popupcard>
    </div>
  );
}
