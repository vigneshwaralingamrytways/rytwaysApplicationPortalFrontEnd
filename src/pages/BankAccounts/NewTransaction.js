import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";

const NewTransaction = ({
  selectedItem,
  saveTransactions,
  onCancel,
  template,
  validate,
}) => {
  return (
    <div className={classes.container}>
      <Popupcard title="Add Transaction" showBack onBack={onCancel}
>
        <CreateForm
          template={template}
          defaultValues={selectedItem}
          onSubmit={saveTransactions}
          onCancel={onCancel}
          buttonName="Save"
          validate={validate}
          rowwise={3}
        />
      </Popupcard>
    </div>
  );
};

export default NewTransaction;
