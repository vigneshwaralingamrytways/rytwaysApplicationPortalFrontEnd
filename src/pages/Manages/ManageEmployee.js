import React, { useCallback, useEffect, useState } from "react";
// import NewPayment from "./NewPayment";
import {
  CreateForm,
  SimpleCard,
  Table,
  api,
  useFetch,
  alertActions,
  modalActions,
  useDispatch,
  useSelector,
  classes,
  Popupcard,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";
import NewEmployee from "./NewEmployee";
import EmployeeTable from "./EmployeeTable";
import Upload from "./Upload";
import PrintSalary from "./PrintSalary";

import { saveAs } from "file-saver";


const ManageEmployee = (props) => {
  const { get, del, post, response, loading, error } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [stateList, setStateList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const [Employee, setEmployee] = useState([]);
  const [defaultValues, setDefaultValues] = useState({});
  const [statusList, setStatusList] = useState([]);

  const [allEmployees, setAllEmployees] = useState([]);

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

  const [EmployeeRole, setEmployeeRole] = useState([]);

  /* ---------------- YOUR EXISTING CODE UNCHANGED ---------------- */

  const loadEmployeeRoles = useCallback(async () => {
    const allEmployeeRoles = await get(api + "/employeeRole/getall");

    if (response.ok) {
      setEmployeeRole(
        allEmployeeRoles.map((item) => ({
          label: item.roleName,
          value: item.roleId,
        }))
      );
    }
  }, [get, response]);

  useEffect(() => {
    loadEmployeeRoles();
  }, [loadEmployeeRoles]);

  const loadStates = useCallback(async () => {
    const data = await get(api + "/state/getall");

    if (response.ok) {
      setStateList(
        data.map((item) => ({
          label: item.stateName,
          value: item.stateId,
        }))
      );
    }
  }, [get, response]);

  const loadCountries = useCallback(async () => {
    const data = await get(api + "/country/getall");

    if (response.ok) {
      setCountryList(
        data.map((item) => ({
          label: item.countryName,
          value: item.countryId,
        }))
      );
    }
  }, [get, response]);

  const loadDepartments = useCallback(async () => {
    const data = await get(api + "/department/department");

    if (response.ok) {
      setDepartmentList(
        data.map((item) => ({
          label: item.departmentName,
          value: item.departmentId,
        }))
      );
    }
  }, [get, response]);

  useEffect(() => {
    loadStates();
    loadCountries();
    loadDepartments();
  }, []);

  const deleteProfilePhoto = async (employeeId) => {
    const formData = new FormData();
    formData.append("employeeId", employeeId);

    const res = await del(api + "/docsUpload/deleteProfilePhoto", formData);

    if (response.ok) {
      AlertHandler("Profile photo deleted", "success");
    } else {
      AlertHandler("Failed to delete profile photo", "danger");
    }
  };

  const template = () => ({
    fields: [

      {
        title: "Employee Name",
        type: "text",
        contains: "text",
        name: "employeeName",
        validationProps: "Employee name is required",
        inpprops: {
          pattern: {
            value: /^[a-zA-Z\s]+(\.[a-zA-Z\s]+)?$/,
            message: "Numbers and special characters are not allowed (only letters, space, and  one dot(.))"
          }
        },
      },

      {
        title: "Employee Salary Role",
        type: "select",
        contains: "text",
        name: "roleId",
        options: EmployeeRole,
        validationProps: "Employee Role name is required",
      },
      {
        title: "Employee Code",
        type: "text",
        contains: "text",
        name: "employeeCode",
        validationProps: "Employee code is required",
      },
      {
        title: "Employee Department",
        type: "select",
        contains: "text",
        name: "departmentId",
        options: departmentList,
        validationProps: "Employee department is required",
      },


      {
        title: "Employee Gender",
        type: "select",
        contains: "text",
        name: "gender",
        options: [
          { label: "Male", val: "Male" },
          { label: "Female", Val: "Female" },
        ],
        validationProps: "Gender is required",
      },

      {
        title: "Permanent Address",
        type: "text",
        contains: "text",
        name: "permanentAddress",
        validationProps: "Permanent address is required",
      },

      {
        title: "Current Address",
        type: "text",
        contains: "text",
        name: "currentAddress",
        validationProps: "Current address is required",
      },

      {
        title: "City",
        type: "text",
        contains: "text",
        name: "city",
        validationProps: "City is required",

      },


      {
        title: "State",
        type: "select",
        contains: "text",
        name: "stateId",
        validationProps: "State is required",
        options: stateList,
      },

      {
        title: "Country",
        type: "select",
        contains: "text",
        name: "countryId",
        options: countryList,
        validationProps: "Country is required",
      },

      {
        title: "PAN Number",
        type: "text",
        contains: "text",
        name: "panNo",
        // validationProps: "PAN number is required",
        inpprops: {
          axlength: 10,
          pattern: {
            value: /^[A-Z]{5}[0-9]{4}[A-Z]$/,
            message: "Invalid PAN Format (e.g. ABCDE1234F)"
          }
        },
      },

      {
        title: "Aadhaar Number",
        type: "text",
        contains: "text",
        name: "aadhaarNo",
        // validationProps: "Aadhaar number is required",
        inpprops: {
          maxlength: 12,
          pattern: {
            value: /^[2-9]{1}[0-9]{11}$/,
            message: "Invalid Aadhaar Format (12 digits required)"
          }
        },
      },
      {
        title: "Blood Group",
        type: "text",
        contains: "text",
        name: "bloodGroup",
        validationProps: "Blood group is required",
        inpprops: {
          maxlength: 4,
          pattern: {
          },
          value: /^(A|B|O|AB|A1|A2|A1B|A2B)[+-]$/,
          message: "Please enter a valid blood group (e.g., A+, A1+, A1B+)"
        }
      },
      {
        title: "Mobile Number",
        type: "number",
        contains: "number",
        name: "mobileNo",
        // validationProps: "Mobile number is required",
        inpprops: {
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: "Invalid Mobile Number (10 digits starting with 6-9)"
          },
          maxlength: 10,
          minlength: 10
        },
      },

      {
        title: "Alternate Contact Number",
        type: "number",
        contains: "number",
        name: "alternateContactNo",
        // validationProps: "Alternate contact number is required",
        inpprops: {
          pattern: {
            value: /^[6-9]\d{9}$/,
            message: "Invalid Mobile Number (10 digits starting with 6-9)"
          },
          maxlength: 10,
          minlength: 10
        },
      },

      {
        title: "Personal Email ID",
        type: "text",
        contains: "text",
        name: "personalEmailId",
        // validationProps: "Personal email ID is required",
        inpprops: {

          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Invalid Email format"
          }
        },
      },

      {
        title: "Official Email ID",
        type: "text",
        contains: "text",
        name: "officialEmailId",
        // validationProps: "Official email ID is required",
        inpprops: {
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Invalid Email format"
          }
        },
      },


      {
        title: "Password",
        type: "password",
        contains: "password",
        name: "password",
        // validationProps: "password is required",
        inpprops: {

          pattern: {
            value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            message: "Password must be min 8 chars, including 1 letter, 1 number and 1 special character"
          }
        },
      },


      {
        title: "Designation",
        type: "text",
        contains: "text",
        name: "designation",
        validationProps: "Designation is required",
        inpprops: {
          pattern: {
            value: /^[a-zA-Z\s]+$/,
            message: "Only letters and spaces are allowed (No numbers or special characters)"
          }
        },
      },
    ],
  });


  const templateforfilter = {
    fields: [
      {
        title: "Employee Name",
        type: "text",
        name: "empName",
      },
    ],
  };

  const loadEmployees = useCallback(async () => {
    const allEmployees = await get(api + "/manageEmployee/getall");
    console.log(" all emp", allEmployees)
    if (response.ok) {
      setEmployee(allEmployees);
      setAllEmployees(allEmployees);
    }
  }, [get, response]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const saveEmployee = async (val) => {
    let savedEmployee;

    if (val.employeeId) {
      savedEmployee = await post(api + "/manageEmployee/update/", val);
    } else {
      savedEmployee = await post(api + "/manageEmployee/create", val);
    }

    if (!savedEmployee || !savedEmployee.employeeId) {
      AlertHandler("Employee save failed", "danger");
      return;
    }

    AlertHandler(
      val.employeeId
        ? "Employee updated successfully"
        : "Employee saved successfully",
      "success"
    );

    setEmployee((prev) =>
      val.employeeId
        ? prev.map((e) =>
          e.employeeId === savedEmployee.employeeId ? savedEmployee : e
        )
        : [...prev, savedEmployee]
    );

    setAllEmployees((prev) =>
      val.employeeId
        ? prev.map((e) =>
          e.employeeId === savedEmployee.employeeId ? savedEmployee : e
        )
        : [...prev, savedEmployee]
    );
  };

  function validate() { }

  const deleteEmployee = async (employeeId) => {
    console.log(" dele is called" + employeeId)
    const deleted = await del(api + "/manageEmployee/delete/" + employeeId);

    if (response.ok) {
      AlertHandler("Employee deleted", "success");
      setEmployee((prev) => prev.filter((c) => c.employeeId !== employeeId));
    }
    else {
      AlertHandler("Employee delete failed", "danger");
    }
  };

  function onSubmit(values) {
    const name = values.empName?.toLowerCase() || "";

    if (!name) {
      setEmployee(allEmployees);
      return;
    }

    const filtered = allEmployees.filter((emp) =>
      emp.employeeName?.toLowerCase().includes(name)
    );

    setEmployee(filtered);
  }

  /* ? SLIDE CLOSE */
  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };
  const actions = ["Edit", "Delete", "Upload", "Add", "Print"];
  /* ? SLIDE FORM HANDLER */
  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item, empRoleId: item.employeeRole?.roleId || item.roleId || "" } : {
      personalEmailId: "",
      officialEmailId: "",
      password: "",
    };

    /* DELETE */
    if (action === "Delete") {
      deleteEmployee(item.employeeId);
      return;
    }

    let selectedComponent = null;

    /* ADD / EDIT */
    if (action === "Add" || isEdit) {
      selectedComponent = (
        <NewEmployee
          selectedItem={formData}
          deleteProfilePhoto={deleteProfilePhoto}
          onCancel={closeSlide}
          saveEmployee={saveEmployee}
          template={template()}
          validate={validate}
          rowWiseFields={4}
        />
      );
    }

    /* UPLOAD */
    if (action === "Upload") {
      selectedComponent = (
        <Upload
          referenceId={item.employeeId}
          referenceType="EMPLOYEE"
          uploadTitle="Manage Employees Documents Upload"
          onCancel={closeSlide}
          validate={validate}
        />
      );
    }

    /* PRINT */
    if (action === "Print") {
      selectedComponent = (
        <PrintSalary
          selectedItem={item}
          onCancel={closeSlide}
          validate={validate}
          rowWiseFields={4}
        />
      );
    }

    /* ? OPEN SLIDE */
    setActiveForm(selectedComponent);
    setIsSlideOpen(true);
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
      {/* ? TABLE */}
      {!isSlideOpen && (
        <NewTable
          cols={EmployeeTable({
            showFormHandler,
            actions,
          })}
          data={Employee}
          striped
          rows={25}
          title="Manages Employee"
          showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          template={templateforfilter}
          rowwise={3}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
          rowWise={4}
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

export default ManageEmployee;
