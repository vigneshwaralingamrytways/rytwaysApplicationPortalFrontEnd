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
import NewEmployee from "./NewEmployee";
import UsersTable from "./UsersTable";

const ManageUsers = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [stateList, setStateList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [EmployeeRole, setEmployeeRole] = useState([]);

  const [Employee, setEmployee] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);

  // ? SLIDE STATE
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

  // ? Close Slide
  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  // ===========================
  // LOAD DROPDOWN DATA
  // ===========================

  const loadEmployeeRoles = useCallback(async () => {
    const allEmployeeRoles = await get(api + "/employeeRole/getall");

    if (response.ok) {
      setEmployeeRole(
        allEmployeeRoles.map((item) => ({
          label: item.empRoleName,
          value: item.empRoleId,
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

  // ===========================
  // TEMPLATE
  // ===========================

  const template = () => ({
    fields: [
      {
        title: "Employee Name",
        type: "text",
        name: "employeeName",
        validationProps: "Employee name is required",
      },
      {
        title: "Employee Salary Role",
        type: "select",
        name: "empRoleId",
        options: EmployeeRole,
      },
      {
        title: "Employee Code",
        type: "text",
        name: "employeeCode",
      },
      {
        title: "Employee Department",
        type: "select",
        name: "departmentId",
        options: departmentList,
      },
      {
        title: "Employee Gender",
        type: "select",
        name: "gender",
        options: [
          { label: "Male", val: "Male" },
          { label: "Female", val: "Female" },
        ],
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
          maxlength: 10
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
          maxlength: 10
        },
      },

      {
        title: "Personal Email ID",
        type: "text",
        contains: "text",
        name: "personalEmailId",
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

  // ===========================
  // LOAD EMPLOYEES
  // ===========================

  const loadEmployees = useCallback(async () => {
    const allEmployeesData = await get(api + "/manageEmployee/getall");

    if (response.ok) {
      setEmployee(allEmployeesData);
      setAllEmployees(allEmployeesData);
    }
  }, [get, response]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  // ===========================
  // SAVE EMPLOYEE
  // ===========================

  const saveEmployee = async (val) => {
    if (val.employeeId) {
      const updateEmployee = await post(api + "/manageEmployee/create/", val);

      if (response.ok) {
        AlertHandler("Employee updated", "success");

        setEmployee((prev) =>
          prev.map((c) =>
            c.employeeId === updateEmployee.employeeId ? updateEmployee : c
          )
        );

        closeSlide();
      }
    } else {
      const newEmployee = await post(api + "/manageEmployee/create", val);

      if (response.ok) {
        AlertHandler("Employee saved", "success");
        setEmployee([...Employee, newEmployee]);

        closeSlide();
      }
    }
  };

  // ===========================
  // FILTER SEARCH
  // ===========================

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

  // ===========================
  // ? SLIDE EDIT HANDLER
  // ===========================

  const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item } : {};

    if (isEdit) {
      setActiveForm(
        <NewEmployee
          selectedItem={formData}
          onCancel={closeSlide}
          saveEmployee={saveEmployee}
          template={template()}
          validate={() => { }}
          rowWiseFields={4}
        />
      );

      setIsSlideOpen(true);
    }
  };

  const actions = ["Edit"];

  return (
    <div className={classes.container}>
      {/* ? TABLE SHOW ONLY WHEN SLIDE CLOSED */}
      {!isSlideOpen && (
        <NewTable
          cols={UsersTable({
            showFormHandler,
            actions,
          })}
          data={Employee}
          striped
          rows={25}
          title="Manage Users"
          template={templateforfilter}
          onSubmit={onSubmit}
          buttonName="Search"
        />
      )}

      {/* ? SLIDE POPUP */}
      <div className={`${classes.sliderPopup} ${isSlideOpen ? classes.open : ""}`}>
        {activeForm}
      </div>
    </div>
  );
};

export default ManageUsers;
