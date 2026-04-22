import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";

const NewHsnCode = ({ selectedItem, saveHsnCode, onCancel, template ,validate}) => {
  return (
    <Popupcard title="HSN Code" showBack onBack={onCancel}>
      <CreateForm
        template={template}
        defaultValues={selectedItem}
        onSubmit={saveHsnCode}
        onCancel={onCancel}
        validate={validate}
        buttonName="Save"
      />
    </Popupcard>
  );
};

export default NewHsnCode;
