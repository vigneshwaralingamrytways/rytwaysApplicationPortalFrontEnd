import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";

const NewSacCode = ({ selectedItem, saveSacCode, onCancel, template, validate }) => {
  return (
    <Popupcard title="SAC Code Master" showBack onBack={onCancel}>
      <CreateForm
        template={template}
        defaultValues={selectedItem}
        onSubmit={saveSacCode}
        onCancel={onCancel}
        validate={validate}
        buttonName="Save"
      />
    </Popupcard>
  );
};

export default NewSacCode;