import React, { useState, useEffect } from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";

export default function NewBankStatement({
  selectedItem,
  onCancel,
  saveBankStatement,
  template,
  validate
}) {
  return (
    <div className={classes.container}>
      <Popupcard title={ "Add Bank Statement"} showBack onBack={onCancel}
>
        <p>Please Select the 1st day of the Month</p>
        <CreateForm
          template={template}
          rowwise={3}
          defaultValues={selectedItem}
          onSubmit={saveBankStatement}
          onCancel={onCancel}
          buttonName="Save"
          validate={validate}
        />
      </Popupcard>
    </div>
  );
}
