import React, { useCallback, useEffect, useState } from "react";
import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import NewAttendenceType from "./NewAttendenceType";
import NewTable from "../../Components/NewTable/NewTable";
import AttendenceTypeMasterTable from "./AttendenceTypeMasterTAble";

const AttendenceTypesMaster = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [attendenceType, setattendenceType] = useState([]);
  const [allAttendenceTypes, setAllAttendenceTypes] = useState([]);

  // ? Slide State
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [showAlert] = useSelector((state) => [
    state.alertProps.showAlert,
  ]);

  // ? Alert Handler
  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

  // ? Template
  const template = {
    fields: [
      {
        title: "Attendence Type",
        type: "text",
        name: "attendenceTypeName",
        contains: "text",
        validationProps: "Attendence Type is required",
      },
    ],
  };

  // ? Load Attendence Types
  const loadattendenceType = useCallback(async () => {
    const allattendenceType = await get(api + "/attendenceType/getall");

    if (response.ok) {
      setattendenceType(allattendenceType);
      setAllAttendenceTypes(allattendenceType);
    } else {
      AlertHandler("Failed to load Attendence Types", "danger");
    }
  }, [get, response]);

  useEffect(() => {
    loadattendenceType();
  }, [loadattendenceType]);

  // ? Close Slide
  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  // ? Save Attendence Type
  const saveattendenceType = async (val) => {
    if (val.attendenceTypeId) {
      const updateattendenceType = await post(
        api + "/attendenceType/update/" + val.attendenceTypeId,
        val
      );

      if (response.ok) {
        AlertHandler("Attendence Type updated successfully", "success");

        setattendenceType((prev) =>
          prev.map((c) =>
            c.attendenceTypeId === updateattendenceType.attendenceTypeId
              ? updateattendenceType
              : c
          )
        );

        closeSlide();
      } else {
        AlertHandler("Updation failed", "danger");
      }
    } else {
      const newAttendenceType = await post(
        api + "/attendenceType/create",
        val
      );

      if (response.ok) {
        AlertHandler("Attendence Type saved successfully", "success");

        setattendenceType([...attendenceType, newAttendenceType]);

        closeSlide();
      } else {
        AlertHandler("Attendence Type not saved", "danger");
      }
    }
  };

  // ? Delete Attendence Type
  const deleteattendenceType = async (attendenceTypeId) => {
    await del(api + "/attendenceType/delete/" + attendenceTypeId);

    if (response.ok) {
      AlertHandler("Attendence Type deleted", "success");

      setattendenceType((prev) =>
        prev.filter((c) => c.attendenceTypeId !== attendenceTypeId)
      );
    } else {
      AlertHandler("Failed to delete Attendence Type", "danger");
    }
  };

  // ? Filter Submit
  function onSubmit(values) {
    const filtered = allAttendenceTypes.filter((a) =>
      !values.attendenceTypeName
        ? true
        : a.attendenceTypeName
            .toLowerCase()
            .includes(values.attendenceTypeName.toLowerCase())
    );

    setattendenceType(filtered);
  }

  // ? Slide Handler for Add/Edit
  const actions = ["Edit", "Delete"];

  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item } : {};

    // ? Add or Edit ? Slide Open
    if (action === "Add" || isEdit) {
      setActiveForm(
        <NewAttendenceType
          selectedItem={formData}
          onCancel={closeSlide}
          saveattendenceType={saveattendenceType}
          template={template}
          validate={() => true}
        />
      );

      setIsSlideOpen(true);
    }

    // ? Delete
    if (action === "Delete") {
      deleteattendenceType(item.attendenceTypeId);
    }
  };

  return (
    <div
      className={classes.container}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "650px",
      }}
    >
      {/* ? Table Hide When Slide Opens */}
      {!isSlideOpen && (
        <NewTable
          cols={AttendenceTypeMasterTable(showFormHandler, actions)}
          data={attendenceType}
          striped
          rows={25}
          title="Attendence Type Master"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          template={template}
          rowwise={3}
          validate={() => true}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
        />
      )}

      {/* ? Slide Popup */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          right: 0,
          width: "100%",
          height: "calc(100% - 60px)",

          transform: isSlideOpen
            ? "translateX(0%)"
            : "translateX(110%)",

          transition: "transform 0.4s ease-in-out",
          overflowY: "auto",
        }}
      >
        {activeForm}
      </div>
    </div>
  );
};

export default AttendenceTypesMaster;
