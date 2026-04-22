import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "./Master.module.css";

export default function NewIssueType({
  selectedItem,
  onCancel,
  saveIssueType,
  template,
  validate,
}) {
  return (
    <div className={classes.container}>
      <Popupcard
        title={
          selectedItem?.issueTypeId
            ? "Edit Issue Type"
            : "Add Issue Type"
        }
      >
        <CreateForm
          template={template}
          rowwise={3}
          defaultValues={selectedItem}
          onSubmit={saveIssueType}
          onCancel={onCancel}
          buttonName="Save"
          validate={validate}
        />
      </Popupcard>
    </div>
  );
}
