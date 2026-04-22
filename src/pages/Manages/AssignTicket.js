import React from "react";
import {
  CreateForm,
  Popupcard,
  classes,
} from "../../Components/CommonImports/CommonImports";

export default function AssignTicket({
  selectedItem,
  onCancel,
  onClose,
  saveTicket,
  template,
  validate,
}) {
  return (
    <div className={classes.container}>
      <Popupcard title={"Assign Ticket"}  showBack onBack={onCancel}>
        <CreateForm
          template={template}
          rowwise={3}
          defaultValues={selectedItem}
          onSubmit={saveTicket}
          onCancel={onCancel}
          buttonName={"Assign"}
          validate={validate}
        />
      </Popupcard>
    </div>
  );
}