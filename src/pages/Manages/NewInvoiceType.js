import React from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";

const NewInvoiceType = ({ selectedItem, onCancel, saveInvoiceType, template,validate }) => {
  
   const handleSubmit = async (formData) => {
    try {
      await saveInvoiceType(formData);
    } catch (error) {
      console.log("Save error:", error);
    }
  };

  return (
    <Popupcard title="Invoice Type" showBack onBack={onCancel}
>
      <CreateForm
        template={template}
        validate={validate}
        defaultValues={selectedItem}
        onSubmit={handleSubmit}
        onCancel={onCancel}
        buttonName="Save"
      />
    </Popupcard>
  );
};

export default NewInvoiceType;
