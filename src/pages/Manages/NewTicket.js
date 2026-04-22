import React from "react";
import {
  CreateForm,
  Popupcard,
  classes,
} from "../../Components/CommonImports/CommonImports";

export default function NewTicket({
  selectedItem,
  onCancel,
  saveTicket,
  template,
  validate,
}) {
  return (
    <div className={classes.container}>
      <Popupcard title={selectedItem?.ticketId ? "Edit Ticket" : "Add Ticket"}
         showBack onBack={onCancel}>
        <CreateForm
          template={template}
          rowwise={3}
          defaultValues={selectedItem}
          onSubmit={saveTicket}
          onCancel={onCancel}
          buttonName={selectedItem?.ticketId ? "Update" : "Save"}
          validate={validate}
        />
      </Popupcard>
    </div>
  );
}