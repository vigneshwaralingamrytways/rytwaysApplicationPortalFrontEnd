import React, { useCallback, useEffect, useState } from "react";
// import { CreateForm, NewTable, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";
import AddDocumentsTable from "./AddFeildsTable";
// import { useDispatch } from "react-redux";
import {
  CreateForm,
  NewTable,
  SimpleCard,
  Table,
  api,
  useFetch,
  alertActions,
  modalActions,
  useDispatch,
  useSelector,

  Popupcard,
} from "../../Components/CommonImports/CommonImports";

export default function NewDocuments({
  selectedItem,

  onCancel,

  showFormHandler,
  actions,
  isEdit, isUpgrade, Title,
  template,
  validate,
  onSubmit, defaultValues, refreshData
}) {


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

  const [documents, SetDocuments] = useState([]);

  const [fieldsList, setFieldsList] = useState([]);



  const loadDocuments = useCallback(async () => {


    const res = await get(api + "/document/getAll/document?t=" + Date.now());
    if (response.ok) {
      SetDocuments(res)
      // AlertHandler("")
      console.log("res for load doc", res)
    }
    else {
      console.log("failed to load", response)
    }

  }, [get, response]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const saveDocuments = useCallback(async (value) => {

    console.log("vaues for save", value)
    const res = await post(api + "document/createDocument?t=" + Date.now(), value)
    if (response.ok) {
      SetDocuments(res)
      onCancel();
      if (refreshData) {
        await refreshData();
      }
      console.log("saved doc", res)
      AlertHandler("document is saved", "success")
    } else {
      console.log("failed to saved", response)
      AlertHandler("failed to saved", "danger")

    }
  }, [post, response.ok, isEdit, selectedItem, onCancel, refreshData]);


  const loadFields = useCallback(async () => {
    // if (isUpgrade && selectedItem?.documentId) {
    if (selectedItem?.documentId) {
      const data = await get(`${api}/feilds/getAll/${selectedItem.documentId}`);
      if (response.ok && data) {
        setFieldsList(data);
      }
    }
    // }
  }, [get,selectedItem?.documentId]);

  useEffect(() => {
    loadFields();
  }, [loadFields]);


  const handleUpgradeSubmit = async (value) => {
    const val = {
      feildName: value.feildName,
      feildValue: value.feildValue,
    };
    console.log("values", val)
    const res = await post(api + "/feilds/createFeilds", val);
    console.log("resulkt ", res)
    if (response.ok) {
      AlertHandler("feilds are saved", "succuss")
      onCancel();
      await loadFields();
    } else {
      AlertHandler("feilds are not saved", "danger")
      console.log("Failed to save field ", "danger");
    }
  };

  return (
    <div className={classes.container}>
      <Popupcard
        title={Title

        }
        showBack onBack={onCancel}

      >

        <CreateForm
          template={template}
          rowwise={3}
          defaultValues={defaultValues}
          onSubmit={saveDocuments}
          onCancel={onCancel}
          buttonName={isUpgrade ? "Upgrade" : "Add"}
          validate={validate}
        />
        {/* {isUpgrade && (
          <NewTable
            cols={AddDocumentsTable(showFormHandler, actions)}

            data={fieldsList}
            striped
            title=" Documents"
            // showPlusCircle={false}
            handleAddClick={showFormHandler({}, "Add")}
            template={template}
            rowwise={4}
            rows={10}
            actions={actions}
            onSubmit={onSubmit}
            // buttonName="Search"
            showFilterIcon={false}
            validate={validate}
          />
        )} */}

      </Popupcard>
    </div>
  );
}
