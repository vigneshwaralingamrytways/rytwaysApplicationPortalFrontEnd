import React from "react";
import { CreateForm ,Popupcard} from "../../Components/CommonImports/CommonImports";
import classes from './Master.module.css'; 

export default function NewCurrency({ selectedItem, onCancel, saveCurrency, template, validate }) {
  return (
    <div className={classes.container}>
       <Popupcard
                title="Add currency" 
                showBack onBack={onCancel}

            >
      <CreateForm
        template={template}
        rowwise={3}
        defaultValues={selectedItem}
        onSubmit={saveCurrency}
        onCancel={onCancel}
        buttonName="Save"
        validate={validate}
      />
      </Popupcard>
    </div>
  );
}
