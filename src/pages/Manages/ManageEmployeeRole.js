import React, { useCallback, useEffect, useState } from "react";
import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";

import NewEmployeeRole from "./NewEmployeeRole";
import EmployeeRoleTable from "./EmployeeRoleTable";

const ManageEmployeeRole = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [EmployeeRole, setEmployeeRole] = useState([]);
  const [defaultValues, setDefaultValues] = useState({});

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
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

  /* ---------------- FILTER TEMPLATE ---------------- */

  const templatefilter = {
    fields: [
      {
        title: "Employee Role",
        type: "text",
        name: "empRoleName",
      },
    ],
  };

  /* ---------------- FORM TEMPLATE ---------------- */

  const template = {
    fields: [
      {
        title: "Role Name",
        type: "text",
        name: "empRoleName",
        validationProps: "role is required",
      },
      {
        title: "Description",
        type: "text",
        name: "empRoleDesc",
        validationProps: "Desc is required",
      },
    ],
  };

  /* ---------------- LOAD EMPLOYEE ROLES ---------------- */

  const loadEmployeeRoles = useCallback(async () => {
    const allEmployeeRoles = await get(api + "/employeeRole/getall");

    if (response.ok) {
      setEmployeeRole(allEmployeeRoles);
    }
  }, [get, response]);

  useEffect(() => {
    loadEmployeeRoles();
  }, [loadEmployeeRoles]);

  /* ---------------- SAVE ROLE ---------------- */

  const saveEmployeeRole = async (val) => {
    const result = await post(api + "/employeeRole/create", val);

    if (response.ok) {
      if (val.empRoleId) {
        setEmployeeRole((prev) =>
          prev.map((x) => (x.empRoleId === val.empRoleId ? result : x))
        );
        AlertHandler("Employee Role updated successfully", "success");
      } else {
        setEmployeeRole([...EmployeeRole, result]);
        AlertHandler("Employee Role created successfully", "success");
      }

      closeSlide();
      setDefaultValues({});
    } else {
      AlertHandler("Failed to save Employee Role", "danger");
    }
  };

  /* ---------------- DELETE ROLE ---------------- */

  const deleteEmployeeRole = async (empRoleId) => {
    await del(api + "/employeeRole/delete/" + empRoleId);

    if (response.ok) {
      AlertHandler("EmployeeRole deleted", "success");
      setEmployeeRole((prev) =>
        prev.filter((c) => c.empRoleId !== empRoleId)
      );
    }
  };

  /* ---------------- SEARCH ---------------- */

  const searchDetails = async (values) => {
    const returnObject = await post(
      api + "/employeeRole/searchEmployeeRole",
      values
    );

    if (returnObject?.length > 0) {
      setEmployeeRole(returnObject);
    } else {
      setEmployeeRole([]);
    }
  };

  function onSubmit(values) {
    searchDetails(values);
  }

  /* ---------------- SLIDE CLOSE ---------------- */

  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  /* ---------------- SHOW FORM HANDLER ---------------- */

  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item } : {};

    if (action === "Add" || isEdit) {
      setActiveForm(
        <NewEmployeeRole
          selectedItem={formData}
          onCancel={closeSlide}
          saveEmployeeRole={saveEmployeeRole}
          template={template}
          validate={() => true}
          rowwise={2}
        />
      );

      setIsSlideOpen(true);
    }

    if (action === "Delete") {
      deleteEmployeeRole(item.empRoleId);
    }
  };

  const actions = ["Edit", "Delete"];

  return (
    <div
      className={classes.container}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "650px",
      }}
    >
      {/* ? TABLE (HIDE WHEN SLIDE OPEN) */}
      {!isSlideOpen && (
        <NewTable
          cols={EmployeeRoleTable(showFormHandler, actions)}
          data={EmployeeRole}
          striped
          rows={25}
          title="Manage Employee Role"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          template={templatefilter}
          rowwise={2}
          validate={() => true}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
        />
      )}

      {/* ? SLIDE PANEL */}
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

export default ManageEmployeeRole;
