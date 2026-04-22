import React, { useState, useEffect, useCallback } from "react";
import classes from "./Master.module.css";

import { useSelector, useDispatch } from "react-redux";
import useFetch from "use-http";
import { modalActions } from '../../store/modal-Slice';
import { alertActions } from "../../store/alert-slice";
import api from "../../Api";

import DepTable from "./DepTable";
import NewTable from "../../Components/NewTable/NewTable";
import NewDepartment from "./NewDepartment";

const rowWiseFields = 4;

function DepMasterSearch(props) {
  const dispatch = useDispatch();

  const [department, setDepartment] = useState([]);
  const { get, post, response } = useFetch({ data: [] });

  /* ? SLIDE STATE */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: true,  // ? FIXED: Always true
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

  /* ---------------- LOAD DEPARTMENT LIST ---------------- */
  const loadDepartments = useCallback(async () => {
    const initialDeps = await get(api + "/department/department");

    if (response.ok) {
      setDepartment(initialDeps);
    }
  }, [get, response]);

  useEffect(() => {
    loadDepartments();
  }, [loadDepartments]);

  /* ---------------- SAVE DEPARTMENT ---------------- */
  const departmentSave = async (Department) => {
    const newDepartment = await post(api + "/department/create", Department);

    if (response.ok) {
      if (Department.departmentId) {
        setDepartment((prev) =>
          prev.map((dep) =>
            dep.departmentId === Department.departmentId ? Department : dep
          )
        );
        AlertHandler("Department Updated Successfully", "success");
      } else {
        setDepartment((prev) => [...prev, newDepartment]);
        AlertHandler("Department Created Successfully", "success");
      }

      closeSlide();
    } else {
      AlertHandler("Department Details Failed To Save", "danger");
      closeSlide();
    }
  };

  /* ---------------- SLIDE CLOSE ---------------- */
  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  /* ---------------- FIXED SHOW FORM HANDLER ---------------- */
  const actions = ["Edit", "Delete"];  // ? Fixed actions array

  const showFormHandler = (item, action) => () => {
  console.log("?? Action:", action, "Item:", item);  // See exact values
  
  // ? Handle both cases
  const normalizedAction = action.toLowerCase();
  const isEdit = normalizedAction === "edit";
  const formData = isEdit ? { ...item } : {};

  if (normalizedAction === "add" || normalizedAction === "edit") {
    setActiveForm(
      <NewDepartment
        key={`dep-form-${Date.now()}`}
        onCancel={closeSlide}
        selectedItem={formData}
        departmentSave={departmentSave}
      />
    );
    setIsSlideOpen(true);
  }
};




  /* ---------------- FILTER TEMPLATE ---------------- */
  const template = {
    fields: [
      {
        title: "Department Name",
        type: "text",
        name: "departmentName",
        contains: "text",
        inpprops: {},
      },
      {
        title: "Department Head",
        type: "text",
        name: "departmentHead",
        contains: "text",
        inpprops: {},
      },
      {
        title: "Ass Department Head",
        type: "text",
        name: "assDepartmentHead",
        contains: "text",
        inpprops: {},
      },
    ],
  };

  function validate() { }

  /* ---------------- SEARCH ---------------- */
  const searchDetails = async (values) => {
    const returnObject = await post(
      api + "/department/searchDepartment",
      values
    );

    if (returnObject.length > 0) {
      setDepartment(returnObject);
    } else {
      setDepartment([]);
    }
  };

  function onSubmit(values) {
    searchDetails(values);
  }

  return (
    <div
      className={classes.container}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "650px",
      }}
    >
      {/* ? TABLE - Disappears when slide opens */}
      <div
        style={{
          transition: "opacity 0.4s ease",
          opacity: isSlideOpen ? 0 : 1,
          pointerEvents: isSlideOpen ? "none" : "auto",
        }}
      >
        <NewTable
          cols={DepTable(showFormHandler, actions)}
          data={department}
          striped
          rows={25}
          title="Department Search"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          template={template}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
        />
      </div>

      {/* ? SLIDE FORM - Slides within table width */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "100%",
          height: "100%",
          background: "white",
          transform: isSlideOpen ? "translateX(0%)" : "translateX(100%)",
          transition: "transform 0.4s ease-in-out",
          zIndex: 999,
          overflowY: "auto",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        {activeForm}
      </div>
    </div>
  );
}

export default DepMasterSearch;
