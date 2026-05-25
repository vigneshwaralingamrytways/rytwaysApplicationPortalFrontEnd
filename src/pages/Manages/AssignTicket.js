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

}) {

  const validate = (watchValues, { setError, clearErrors }) => {
    if (watchValues.assignedOnTime) {
      const assignedTime = new Date(watchValues.assignedOnTime).getTime();
      const currentTime = new Date().getTime();

      if (assignedTime < currentTime) {
        setError("assignedOnTime", {
          type: "manual",
          message: "Assignment Time cannot be in the past",
        });
      } else {
        clearErrors("assignedOnTime");
      }
    }
    return true;
  };
  return (
    <div className={classes.container}>
      <Popupcard title={"Assign Ticket"} showBack onBack={onCancel}>
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