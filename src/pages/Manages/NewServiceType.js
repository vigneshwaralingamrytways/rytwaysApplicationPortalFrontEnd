import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";

const NewServiceType = ({ selectedItem, saveServiceType, onCancel, template ,validate}) => {
  
  
  return (
    <Popupcard title="Service Type" showBack onBack={onCancel}
>
      <CreateForm
        template={template}
        defaultValues={selectedItem}
        validate={validate}
        onSubmit={saveServiceType}
        onCancel={onCancel}
        buttonName="Save"
      />
    </Popupcard>
  );
};

export default NewServiceType;
