import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "./Master.module.css";

export default function NewCountry({
  selectedItem,
  onCancel,
  saveCountry,
  template,
  validate
}) {
  return (
   <div className={classes.container}>
            <Popupcard
                title="Add country"
                showBack onBack={onCancel} 

            >
      <CreateForm
        template={template}
        rowwise={3}
        defaultValues={selectedItem}
        onSubmit={saveCountry}
        onCancel={onCancel}
        buttonName="Save"
        validate={validate}
      />
     </Popupcard>
    </div>
  );
}
