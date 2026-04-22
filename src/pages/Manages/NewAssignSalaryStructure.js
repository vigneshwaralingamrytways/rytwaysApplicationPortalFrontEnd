import React, { useState, useEffect } from "react";
import { CreateForm, Popupcard, NewTable } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";
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
import NewAssignSalaryStructureTable from "./NewAssignSalaryStructureTable";

export default function NewAssignSalaryStructure({
  selectedItem,
  employeeId,
  onCancel,
  onSave,
  template,
  validate,
  title,
  actions,
  roleSalaryDefs,
  showFormHandler
}) {
  const [tableData, setTableData] = useState([]);
  const finalTitle = title || "Assign Salary Structure";
  const handleValueChange = (id, value) => {
    setTableData(prev =>
      prev.map(item =>
        item.salaryDefineId === id
          ? {
            ...item,
            componentValue: value,
            currentComponentValue: value
          }
          : item
      )
    );
  }; useEffect(() => {
    setTableData(roleSalaryDefs);
  }, [roleSalaryDefs]);

  return (
    <div className={classes.container}>
      <Popupcard
        title={finalTitle}
        showBack onBack={onCancel}

      >
        {/* <CreateForm
           template={template}
        rowwise={3}
        defaultValues={selectedItem}
        onSubmit={saveRequest}
        onCancel={onCancel}
        buttonName="Add"
        validate={validate}
       
      /> */}



        <NewTable
          cols={NewAssignSalaryStructureTable({
            showFormHandler,
            actions,
            onValueChange: handleValueChange,

          })}
          data={tableData || []}


          striped
          rows={10}
          title={" Assign Salary Structure"}




        // title={=}
        // showPlusCircle={false}
        />

        <div  >
          <button onClick={onCancel}>
            Cancel
          </button>
          <button

            onClick={() => onSave(tableData, employeeId)}
          >
            Save
          </button>
        </div>
      </Popupcard>
    </div>
  );
}
