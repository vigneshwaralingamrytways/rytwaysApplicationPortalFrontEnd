import React, {
  useState, useEffect

} from "react";
import { CreateForm, NewTable, Popupcard } from "../../Components/CommonImports/CommonImports.js";
import classes from "../Master/Master.module.css";
import {
  alertActions,
  useDispatch,
  useSelector,
} from "../../Components/CommonImports/CommonImports.js";
import NewDefineSalaryStructureTable from "./NewDefineSalaryStructureTable.js";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  // InputGroup,
  // FormControl
} from "react-bootstrap";
import NewSalaryUpdateTable from "./NewSalaryUpdateTable.js";
import { Create } from "@mui/icons-material";

export default function NewSalaryUpdate({
  showFormHandler, actions,
  employee,
  salaryRows,
  saveSalaryUpdate,
  loadMonthSalary,
  selectedMonth,
  onCancel, title, template, validate, reload
}) {

  const dispatch = useDispatch();
  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);
  const [isMonthAssigned, setIsMonthAssigned] = useState(false);
  const [localMonth, setLocalMonth] = useState(selectedMonth || null);
  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };
  const finalTitle = title || "Update Salary";
  // const [localMonth, setLocalMonth] = useState(selectedMonth);
  // const onCancel=()=>{

  // }
  // const showFormHandler=()=>{

  // }

  const [rows, setRows] = useState(
    salaryRows.map(r => ({
      ...r,
      beforeEditedValue: r.currentComponentValue,
    }))
  );


  const firstDay = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  }

  useEffect(() => {
    if (selectedMonth) {
      setLocalMonth(selectedMonth);
    }
  }, [selectedMonth]);

  const fetchMonthSalary = async (month) => {
    const m = firstDay(month)
    const updates = await loadMonthSalary(employee.employeeId, m);

    if (updates && updates.length > 0) {
      // setIsMonthAssigned(true);
      setRows(
        salaryRows.map((assign) => {
          const upd = updates.find(
            (u) => u.salaryAssignId === assign.salaryAssignId
          );
          return upd
            ? {
              ...assign,
              currentComponentValue: upd.currentComponentValue,
              historyComponentValue: upd.historyComponentValue,
              salaryUpdateId: upd.salaryUpdateId,
              beforeEditedValue: upd.currentComponentValue,
            }
            : {
              ...assign,
              beforeEditedValue: assign.currentComponentValue
            };
        })
      );
    } else {
      // setIsMonthAssigned(false);
      setRows(
        salaryRows.map((r) => ({
          ...r,
          currentComponentValue: r.currentComponentValue,
          beforeEditedValue: r.currentComponentValue
        }))
      );
    }
  };




  function onSubmit(values) {
    if (!values.selectedMonth) {
      AlertHandler("Please select month", "danger");
      return;
    }
    // const month = firstDay(new Date(values.selectedMonth))
    setLocalMonth(values.selectedMonth);
    fetchMonthSalary(values.selectedMonth);
  }



  const onValueChange = (id, value, index) => {
    setRows(prev =>
      prev.map((r, i) =>
        r.salaryAssignId === id || i === index
          ? { ...r, currentComponentValue: value }
          : r
      )
    );
  };

  // const onSave = async () => {
  //   for (const r of rows) {
  //     if (!r.salaryAssignId) {
  //       console.log("unassigned salary:", r.componentName);
  //       continue;
  //     }
  //     // await saveSalaryUpdate(r.salaryAssignId, r.currentComponentValue);
  //     if (r.beforeEditedValue !== r.currentComponentValue) {
  //    const saved= await saveSalaryUpdate(
  //       r.salaryAssignId,
  //       r.currentComponentValue,
  //       selectedMonth
  //     );
  //     if(saved){
  //       AlertHandler("updated","succuss")
  //     }

  //   }
  //   // await reload();
  //   }
  //   onCancel();
  // };
  const onSave = async () => {
    if (!localMonth) {
      AlertHandler("Please select month", "danger");
      return;
    }

    let updatedCount = 0;
    let updated = false;
    let errorOccurred = false;

    for (const r of rows) {
      if (!r.salaryAssignId) continue;

      if (r.beforeEditedValue !== r.currentComponentValue) {
        const res = await saveSalaryUpdate(
          r.salaryAssignId,
          r.currentComponentValue,
          // firstDay(localMonth)
          localMonth
        );
        // updated = true;
        if (res && (res.status === 500 || res.error || res.status === 400)) {
          errorOccurred = true;
          console.log("Error saving row:", res);
        } else {
          updatedCount++;
        }
        console.log("resl for savesalary update..", res)
      }
    }

    if (errorOccurred) {
      AlertHandler("update failed", "danger")
    }
    else if (updatedCount > 0) {
      AlertHandler("succusfully updated  salry ", "success")
      reload()
      onCancel();

    }
    else {
      onCancel();
    }
    // if (updated) {
    //   AlertHandler("Salary updated successfully", "success");
    //   reload()
    // }
    // setLocalMonth(null);
    // setRows(
    //   salaryRows.map(r => ({
    //     ...r,
    //     beforeEditedValue: r.currentComponentValue
    //   }))
    // );


  };


  const btnName = localMonth ? "Update" : "Get";
  return (
    <div className={classes.container}>
      <Popupcard
        title={finalTitle}
        showBack onBack={onCancel}

      >

        <CreateForm
          key={localMonth ? localMonth.toString() : "reset"}
          template={template}
          rowWiseFields={3}
          onCancel={onCancel}
          buttonName={btnName}
          validate={validate}
          defaultValues={{ selectedMonth: localMonth }}
          onSubmit={onSubmit}
        />





        <NewTable
          cols={NewSalaryUpdateTable({
            showFormHandler,
            actions,
            onValueChange
          })}
          data={rows}
          striped
          rows={10}
          title={"Update Salary"}


        // title={=}
        // showPlusCircle={false}
        />
        <div  >
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onSave}>Save</button>
        </div>
      </Popupcard>
    </div>
  );
}
