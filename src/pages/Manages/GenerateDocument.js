import React, { useEffect, useState, useCallback } from "react";
import NewTable from "../../Components/NewTable/NewTable";
import { api, useFetch } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";
import GenerateDocumentTable from "./GenerateDocumentTable";
import {
  CreateForm,

  alertActions, useSelector,
  useDispatch,
  Popupcard,
} from "../../Components/CommonImports/CommonImports";

const GenerateDocument = ({ document, onCancel, defaultValues, validate, selectedItem }) => {

  // const { get, response } = useFetch({ data: [] });
  const [fields, setFields] = useState([]);




  const { get, del, post, put, response, loading, error } = useFetch({ data: [] });
  const dispatch = useDispatch();

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

  useEffect(() => {
    loadFields();
  }, []);

  const loadFields = async () => {
    const res = await get(api + `/feilds/getAll/${document.documentId}?=t=${Date.now()}`);
    if (response.ok) {
      setFields(res);
    }
  };


  const firstThreeFields = fields.slice(0, 3);
  const template = {

    fields: [
      {
        // legend: "Transaction Details",
        inpprops: {},
        title: "Date",
        type: "date",
        name: "date",
        contains: "date",
        validationProps: "Date is required",
      },
    ]
  }

  // const validate={

  // }
  const onSubmit = {

  }

  const handleGenerate = async (docItem) => {
    if (!docItem || !docItem.documentId) return;
    const res = await get(api + "/document/generate/" + docItem.documentId);
    if (response.ok) {
      console.log("Response:", res);
      AlertHandler("Document Generated & Saved Successfully!", "success");
        await  loadFields();
    } else {
      console.log("Error Response:", response);
      AlertHandler("Failed to generate document", "danger");
    }
  };
  const SaveFeilds = useCallback(async (value) => {
    const val = {
      ...value,
      documentId: selectedItem.documentId,
      feildName: "date",
      feildValue: value.date,
    };
    console.log("values", value)
    console.log("val ", val)
    const res = await post(api + "/feilds/createFeilds?t=" + Date.now(), val);
    console.log("result ", res)
    if (response.ok) {
      AlertHandler("feild is saved", "success")
     await  loadFields();
    } else {
      AlertHandler("feilds are not saved", "danger")
      console.log("Failed to save field ", response);
    }
  })





  return (

    <div className={classes.container}>
      <Popupcard
        title={"Generate Document" } showBack onBack={onCancel}>
        <CreateForm
          template={template}
          rowwise={3}
          // defaultValues={selectedItem}
          defaultValues={defaultValues}
          onSubmit={SaveFeilds}
          onCancel={onCancel}
          buttonName="Add"
          validate={validate}
        />

        <NewTable
          title="Generate Document"
          data={[document]}
          cols={GenerateDocumentTable(firstThreeFields, handleGenerate, document)}
          rows={1}
          showFilterIcon={false}
        />
      </Popupcard>
    </div>
  );
};

export default GenerateDocument;