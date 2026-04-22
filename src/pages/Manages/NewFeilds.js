import React, { useCallback, useEffect, useState } from "react";
// import { CreateForm, NewTable, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";
// import AddDocumentsTable from "./AddFeildsTable";
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
import AddFeildsTable from "./AddFeildsTable";
// import { valueContainerCSS } from "react-select/dist/declarations/src/components/containers";


export default function NewFeilds({
    selectedItem,

    onCancel,



    isEdit, isUpgrade, Title,
    template,
    validate,
    onSubmit, defaultValues
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
    const [formValues, setFormValues] = useState({});
    const [fieldsList, setFieldsList] = useState([]);

    const [formData, setFormData] = useState({});
    const [isUpdate, setIsUpdate] = useState(false);

    // const loadDocuments = useCallback(async () => {


    //     const res = await get(api + "/document/getAll/document");
    //     if (response.ok) {
    //         SetDocuments(res)
    //         // AlertHandler("")
    //         console.log("res for load doc", res)
    //     }
    //     else {
    //         console.log("failed to load", response)
    //     }

    // }, [response]);

    // useEffect(() => {
    //     loadDocuments();
    // }, [loadDocuments]);

    // const saveDocuments = useCallback(async (value) => {

    //     console.log("vaues for save", value)
    //     const res = await post(api + "document/createDocument", value)
    //     if (response.ok) {
    //         SetDocuments(res)
    //         console.log("saved doc", res)
    //         AlertHandler("document is saved", "success")
    //     } else {
    //         console.log("failed to saved", response)
    //         AlertHandler("failed to saved", "danger")

    //     }
    // }, [])


    const loadFields = useCallback(async () => {
        // if (selectedItem?.documentId) {
        const data = await get(`${api}/feilds/getAll/${selectedItem.documentId}?t=${Date.now()}`);
        console.log("all feilds for the doc", data)
        if (response.ok) {
            setFieldsList(data);
        } else {
            console.log("response", response)
        }
    }, [get, selectedItem?.documentId]);

    useEffect(() => {
        loadFields();
    }, [loadFields]);


    const handleEdit = (row) => {
        console.log("Editing rows:", row);
        setFormData(row);
        setIsUpdate(true);
    };
    const handleDelete = async (feildId) => {
        const res = await del(api + "/feilds/delete/" + feildId);
        console.log("res for delete", res)
        if (response.ok) {
            AlertHandler("Field deleted successfully", "success");
            console.log("deleted response", response)
            setFieldsList((prev) => prev.filter((item) => item.feildId !== feildId));
        } else {
            AlertHandler("Failed to delete field", "danger");
        }
    };
    const SaveFeilds = useCallback(async (value) => {
        const val = {
            ...value,
            documentId: selectedItem.documentId,
            feildName: value.feildName,
            feildValue: value.feildValue,
        };
        console.log("values", value)
        console.log("val ", val)
        const res = await post(api + "/feilds/createFeilds", val);
        console.log("result ", res)
        if (response.ok || res) {
            // setFieldsList(res);
            AlertHandler("feild is saved", "success")

            setFormValues({});
            if (Array.isArray(res)) {
                setFieldsList(res);
            } else {
                await loadFields();
            }
        } else {
            AlertHandler("feilds are not saved", "danger")
            console.log("Failed to save field ", response);
        }
    }, [selectedItem.documentId, put, post, response.ok, loadFields]);




    const actions = ["Edit", "Delete"];

    const showFormHandler = (item, action) => () => {
        const isPara = action === "Paragraph"
        const isFeild = action === "Feild"
        if (action === "Edit") {
            // setFormData(item);
            // setIsUpdate(true);
            // handleEdit(item)
            setFormValues(item);
        }


        if (action === "Delete") {
            handleDelete(item.feildId)
        }

    }



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
                    // defaultValues={selectedItem}
                    // defaultValues={defaultValues}
                    defaultValues={formValues}
                    onSubmit={SaveFeilds}
                    onCancel={onCancel}
                    buttonName="Add"
                    validate={validate}
                />

                <NewTable
                    cols={AddFeildsTable(showFormHandler, actions)}

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


            </Popupcard>
        </div>
    );
}
