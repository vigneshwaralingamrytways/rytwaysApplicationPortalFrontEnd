import React, { useState } from "react";
import { CreateForm, NewTable, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";

import NewDefineSalaryStructureTable from "./NewDefineSalaryStructureTable";
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

export default function NewDefineSalaryStructure({
  empRoleId,
  selectedItem,
  onCancel,
  salaryDefine,
  template,
  validate,
  title,
  actions,
  showFormHandler,
  saveSalaryDefine,
  reloadSalaryDefine,
}) {
  const [formData, setFormData] = useState({});
  const finalTitle = title || "Define Salary Structure";

  // const onCancel=()=>{

  // }
  // const showFormHandler=()=>{

  // }

  // const [earnings, setEarnings] = useState([""]);
  // const [deductions, setDeductions] = useState([""]);
  // const [statutory, setStatutory] = useState([""]);
  // // setEarnings([...earnings, ""]);
  // // onChange={(e)=> updateEarning(index, e.target.value)}

  // const handleAdd = () => {
  //   const newRow = {
  //     earnings,
  //     deductions,
  //     statutory
  //   };

  //   saveRequest(newRow);
  // };
  const [localSalaryDefine, setLocalSalaryDefine] = useState(
    salaryDefine.filter(sd => sd.empRoleId === empRoleId)
  );


  const handleSubmit = async (formValues) => {
    const saved= await saveSalaryDefine({
      ...formValues,
      empRoleId,
      salaryDefineId: formData.salaryDefineId || null
    });
    // setFormData({});
    // await reloadSalaryDefine();
    if (saved){
setLocalSalaryDefine( prev =>[...prev ,saved])
    }
  };


  const roleWiseSalaryDefine = salaryDefine.filter(
    (sd) => sd.empRoleId === empRoleId
  );

  return (
    <div className={classes.container}>
      <Popupcard
        title={finalTitle}
        showBack onBack={onCancel}

      >
        <CreateForm
          template={template}
          rowwise={3}
          defaultValues={selectedItem}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          buttonName="Add"
          validate={validate}

        />







        <NewTable
          cols={NewDefineSalaryStructureTable({
            showFormHandler,
            actions,
          })}
          data={localSalaryDefine}
          striped
          rows={10}
          title={" Define Salary Structure"}


        // title={=}
        // showPlusCircle={false}
        />

      </Popupcard>
    </div>
  );
}
