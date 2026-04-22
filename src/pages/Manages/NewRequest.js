import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";


export default function NewRequest({
  selectedItem,
  onCancel,
  saveRequest,
  template,
  validate,
  title,
  actions,
}) {

const finalTitle = title || "Add Request";


  return (
   <div className={classes.container}>
            <Popupcard
                title ={ finalTitle}
                showBack onBack={onCancel}


            >
      <CreateForm
          template={template(!!selectedItem?.RequestId, false)}
        rowwise={3}
        defaultValues={selectedItem}
        onSubmit={saveRequest}
        onCancel={onCancel}
        buttonName="Add"
        validate={validate}
        // watchFields={["requestType"]}
      />

     
     </Popupcard>
    </div>
  );
}
