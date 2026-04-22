import React, { useState } from "react";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";
import CirclePhotoUpload from "./CirclePhotoUpload";
import { useEffect } from "react";
import { api } from "../../Components/CommonImports/CommonImports";


export default function NewEmployee({
  selectedItem,
  onCancel,
  saveEmployee,
  template,
  validate,
  actions, deleteProfilePhoto,
}) {

  const [profilePic, setProfilePic] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  useEffect(() => {
    if (selectedItem?.employeeId) {
      setExistingImageUrl(
        api + "/docsUpload/view/" + selectedItem.employeeId + "?t=" + new Date().getTime()
      );
    } else {
      setExistingImageUrl(null);
    }
  }, [selectedItem]);

  const handleImageSelect = (file) => {
    setProfilePic(file);
  };

  const handleDelete = async () => {
    if (!selectedItem?.employeeId) return;
    const success = await deleteProfilePhoto(selectedItem.employeeId);
    console.log(" succus,",success)
    if (success) {
      setExistingImageUrl(null);
      setProfilePic(null);
    }
  }

  const onSubmit = (values) => {
    saveEmployee({ ...values, employeePhoto: profilePic });
  }
  return (
    <div className={classes.container}>
      <Popupcard
        title="Add Employee"
        showBack onBack={onCancel}

      >
        <CirclePhotoUpload
          onImageSelect={handleImageSelect}
          employeeId={selectedItem?.employeeId}
          existingImage={existingImageUrl}
          onDelete={handleDelete} />
        <CreateForm
          template={template}
          rowwise={3}
          defaultValues={selectedItem}
          // onSubmit={saveEmployee}
          onSubmit={onSubmit}
          onCancel={onCancel}
          buttonName="Save"
          validate={validate}
        />


      </Popupcard>
    </div>
  );
}
