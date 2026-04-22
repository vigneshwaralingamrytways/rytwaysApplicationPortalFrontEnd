import React, { useCallback, useEffect, useState } from "react";

import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
  Popupcard,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";

import NewAssignSalaryStructure from "./NewAssignSalaryStructure";
import AssignSalaryStructureTable from "./AssignSalaryStructureTable";

const AssignSalaryStructure = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [Employee, setEmployee] = useState([]);
  const [AllEmployee, setAllEmployee] = useState([]);
  const [EmployeeRole, setEmployeeRole] = useState([]);
  const [salaryDefine, setSalaryDefine] = useState([]);
  const [componentType, setComponentType] = useState([]);

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

  /* ---------------- TEMPLATE ---------------- */

  const template = {
    fields: [
      {
        title: "Component Type",
        type: "select",
        name: "componentTypeId",
        validationProps: "type is required",
        options: componentType,
      },
      {
        title: "Component Name",
        type: "select",
        name: "compName",
        validationProps: "comp name is required",
        options: [
          { label: "select", val: "" },
          { label: "Earnings", val: "Earnings" },
          { label: "Deduction", val: "Deduction" },
          { label: "Statutory", val: "Statutory" },
        ],
      },
      {
        title: "Component Value",
        type: "number",
        name: "compVal",
        validationProps: "comp value is required",
      },
    ],
  };

  /* ---------------- FILTER TEMPLATE ---------------- */

  const templateforfilter = {
    fields: [
      {
        title: "Employee Role",
        type: "select",
        name: "roleId",
        options: [
          { label: "All", value: "" },
          ...EmployeeRole.map((role) => ({
            label: role.empRoleName,
            value: role.roleId,
          })),
        ],
      },
    ],
  };

  /* ---------------- LOAD COMPONENT TYPES ---------------- */

  const loadComponentTypes = useCallback(async () => {
    const allTypes = await get(api + "/componentType/getall");

    if (response.ok) {
      setComponentType(
        allTypes.map((item) => ({
          label: item.componentType,
          value: item.componentTypeId,
        }))
      );
    }
  }, [get, response]);

  useEffect(() => {
    loadComponentTypes();
  }, [loadComponentTypes]);

  /* ---------------- LOAD EMPLOYEE ROLES ---------------- */

  const loadEmployeeRoles = useCallback(async () => {
    const allRoles = await get(api + "/employeeRole/getall");

    if (response.ok) {
      setEmployeeRole(allRoles);
    }
  }, [get, response]);

  useEffect(() => {
    loadEmployeeRoles();
  }, [loadEmployeeRoles]);

  /* ---------------- LOAD SALARY DEFINES ---------------- */

  const loadSalaryDefines = useCallback(async () => {
    const data = await get(api + "/salaryDefine/getall");
    console.log("all define sal", data)
    if (response.ok) {
      setSalaryDefine(data);
    }
  }, [get, response]);

  useEffect(() => {
    loadSalaryDefines();
  }, [loadSalaryDefines]);

  /* ---------------- LOAD EMPLOYEES ---------------- */

  const loadEmployees = useCallback(async () => {
    const allEmployees = await get(api + "/manageEmployee/getall");
    const assignRes = await get(api + "/assignSalary/getall");
    console.log(" emp", allEmployees, "assignres", assignRes)
    if (response.ok) {
      const combined = allEmployees.map((emp) => {
        const assignedForThisEmp = assignRes.filter(
          (a) => Number(a.employeeId) === Number(emp.employeeId) && a.encodedCurrentComponentValue !== null
        );
        return {
          ...emp,
          isAssignedSalary: assignedForThisEmp.length > 0,
          assignedSalaries: assignedForThisEmp
        };
      });


      setEmployee(combined);
      setAllEmployee(combined);
    }
  }, [get, response]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  /* ---------------- SAVE ASSIGNED SALARY ---------------- */

  const saveAssignedSalary = async (data, employeeId) => {
    const values = data.map((r) => ({
      employeeId: employeeId,
      roleId: r.roleId,
      salaryDefineId: r.salaryDefineId,
      currentComponentValue: Number(
        r.componentValue ?? r.defineComponentValue
      ),
      historyComponentValue: 0,
    }));

    const result = await post(api + "/assignSalary/create", values);

    if (response.ok) {
      AlertHandler("Salary assigned successfully", "success");

      closeSlide();
      loadEmployees();
    } else {
      AlertHandler("Failed to assign salary", "danger");
    }
  };

  /* ---------------- FILTER SUBMIT ---------------- */

  function onSubmit(values) {
    const roleId = Number(values?.roleId);

    if (!roleId) {
      setEmployee(AllEmployee);
      return;
    }
    setEmployee(AllEmployee.filter((emp) => Number(emp.roleId) === roleId));
  }

  /* ---------------- SLIDE CLOSE ---------------- */

  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  /* ---------------- SHOW FORM HANDLER (SLIDE OPEN) ---------------- */

  const showFormHandler = (item, action) => () => {
    if (action === "Assign") {
      const roleHasDefinition = salaryDefine.some(
        (def) => Number(def.roleId) === Number(item.roleId)
      );
      if (!roleHasDefinition && !item.isAssignedSalary) {
        AlertHandler("Please assign the salary for this role first", "danger");
        return;
      }
      let roleSalaryDefs = [];
      if (item.isAssignedSalary) {
        roleSalaryDefs = item.assignedSalaries.map((as) => ({
          ...as.salaryDefine,
          componentValue: as.currentComponentValue,
          salaryDefineId: as.salaryDefineId
        }));
      } else {
        roleSalaryDefs = salaryDefine
          .filter((i) => i.roleId === item.roleId)
          .map((def) => ({
            ...def,
            componentValue: def.componentValue,
          }));
      }
      setActiveForm(
        <NewAssignSalaryStructure
          selectedItem={item}
          employeeId={item.employeeId}
          onCancel={closeSlide}
          template={template}
          validate={() => { }}
          rowWiseFields={4}
          title={`${item.employeeName} - Assign Salary Structure`}
          roleSalaryDefs={roleSalaryDefs}
          onSave={saveAssignedSalary}
        />
      );

      setIsSlideOpen(true);
    }
  };

  /* ---------------- ACTIONS ---------------- */

  console.log("all data for the asisgned", Employee)
  return (
    <div
      className={classes.container}
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "650px",
      }}
    >
      {/* ? TABLE VIEW (HIDE WHEN SLIDE OPEN) */}

      {!isSlideOpen && (
        <NewTable
          cols={AssignSalaryStructureTable({
            showFormHandler,salaryDefine

          })}
          data={Employee}
          striped
          rows={25}
          title="Assign Salary Structure"
          template={templateforfilter}
          rowwise={3}
          validate={() => { }}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
          rowWise={4}
        />
      )}

      {/* ? SLIDE PANEL (ApproveRequest Style) */}
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
        <Popupcard>{activeForm}</Popupcard>
      </div>
    </div>
  );
};

export default AssignSalaryStructure;
