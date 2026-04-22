import React, { useCallback, useEffect, useState } from "react";

import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports.js";

import NewTable from "../../Components/NewTable/NewTable.js";
import NewSalaryUpdate from "./NewSalaryUpdate.js";
import SalaryUpdateTable from "./SalaryUpdateTable";

const SalaryUpdate = (props) => {
  const { get, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [selectedMonth, setSelectedMonth] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [filterMonth, setFilterMonth] = useState(null);
  const [filterYear, setFilterYear] = useState(null);

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
        title: "Month",
        type: "date",
        contains: "date",
        name: "selectedMonth",
        validationProps: "month is required",
        inpprops: {},
        options: [],
      },
    ],
  };

  const templateforfilter = {
    fields: [
      {
        title: "month",
        type: "date",
        name: "selectedDate",
      },
    ],
  };

  function validate() { }

  /* ---------------- LOAD DATA ---------------- */

  const loadData = useCallback(async () => {
    const empRes = await get(`${api}/manageEmployee/getall`);
    const allEmployees = await get(api + "/manageEmployee/getall");
    const assignRes = await get(`${api}/assignSalary/getall`);
    const defineRes = await get(`${api}/salaryDefine/getall`);
    console.log("emp", allEmployees, "assigend res", assignRes, "defined", defineRes)
    if (!response.ok) return;

    const combined = allEmployees.map((emp) => {
      const roleId = emp.roleId;

      const roleDefines = defineRes.filter((d) => d.roleId === roleId);

      const assigned = assignRes.filter(
        (a) => Number(a.employeeId) === Number(emp.employeeId)
      );

      const firstSalaryDate = assigned?.[0]?.salaryDate;

      const month = firstSalaryDate
        ? new Date(firstSalaryDate).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })
        : "-";

      const salaries = roleDefines.map((def) => {
        const assignedRow = assigned.find(
          (a) => a.salaryDefineId === def.salaryDefineId
        );
        const isAssignedSalary = assigned.length > 0;
        return {
          salaryAssignId: assignedRow?.salaryAssignId || null,
          salaryDefineId: def.salaryDefineId,
          componentType: def.componentType?.componentType,
          componentName: def.componentName,
          historyComponentValue: assignedRow?.historyComponentValue ?? 0,
          currentComponentValue: assignedRow
            ? assignedRow.currentComponentValue
            : def.componentValue,
          salaryDate: assignedRow?.salaryDate,
        };
      });

      const hasActualValue = assigned.some(a => a.currentComponentValue !== null);
      return {
        employeeId: emp.employeeId,
        employeeName: emp.employeeName,
        employeeCode: emp.employeeCode,
        email: emp.officialEmailId,
        roleName: emp.role?.roleName || "No Role",
        isAssignedSalary: assigned.length > 0 && hasActualValue,
        month,
        salaries,
      };
    });

    setEmployees(combined);
  }, [get, response, filterMonth, filterYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ---------------- FILTER SUBMIT ---------------- */

  function onSubmit(values) {
    if (!values.selectedDate) {
      AlertHandler("Please select month", "danger");
      return;
    }

    const d = new Date(values.selectedDate);
    setFilterMonth(d.getMonth() + 1);
    setFilterYear(d.getFullYear());
  }

  /* ---------------- LOAD MONTH SALARY ---------------- */

  const loadMonthSalary = async (empId, selectedMonth) => {
    const d = new Date(selectedMonth);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;

    let date = `${year}-${String(month).padStart(2, "0")}-01`;

    return await get(`${api}/salaryUpdate/month/${empId}/${date}`);
  };

  /* ---------------- SAVE SALARY UPDATE ---------------- */

  const saveSalaryUpdate = async (salaryAssignId, value, selectedMonth) => {
    const now = new Date(selectedMonth);
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    const savesalary = await post(
      `${api}/salaryUpdate/create/${salaryAssignId}/${value}/${year}/${month}`
    );

    if (!savesalary) {
      AlertHandler("Failed to update salary", "danger");
    } else {
      AlertHandler("Salary updated successfully", "success");
    }

    return savesalary;
  };

  /* ---------------- SLIDE CLOSE ---------------- */

  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
  };

  /* ---------------- ACTION HANDLER ---------------- */

  const showFormHandler = (item, action) => () => {
    if (action === "Update" && !item.isAssignedSalary) {
      AlertHandler("Salary not assigned. Please assign salary first.", "danger");
      return;
    }

    const defaultMonth =
      item?.salaries?.[0]?.salaryDate
        ? new Date(item.salaries[0].salaryDate)
        : null;

    setSelectedMonth(defaultMonth);

    if (action === "Update") {
      setActiveForm(
        <NewSalaryUpdate
          employee={item}
          onCancel={closeSlide}
          salaryRows={item.salaries || []}
          template={template}
          validate={validate}
          loadMonthSalary={loadMonthSalary}
          rowWiseFields={4}
          saveSalaryUpdate={saveSalaryUpdate}
          selectedMonth={selectedMonth}
          reload={loadData}
        />
      );

      setIsSlideOpen(true);
    }
  };

  /* ---------------- TABLE ACTIONS ---------------- */

  const getActions = (row) => {
    return row.isAssignedSalary ? ["Update"] : ["Assign"];
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
      {/* ? TABLE HIDE WHEN SLIDE OPEN */}
      {!isSlideOpen && (
        <NewTable
          cols={SalaryUpdateTable({
            showFormHandler,
            getActions,
          })}
          data={employees}
          striped
          rows={25}
          title="Update Salary"
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
          transform: isSlideOpen ? "translateX(0%)" : "translateX(110%)",
          transition: "transform 0.4s ease-in-out",
          overflowY: "auto",
        }}
      >
        {activeForm}
      </div>
    </div>
  );
};

export default SalaryUpdate;
