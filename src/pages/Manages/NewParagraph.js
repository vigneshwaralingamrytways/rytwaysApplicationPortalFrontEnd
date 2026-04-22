import React, { useCallback, useEffect, useState } from "react";
// import { CreateForm, NewTable, Popupcard } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";
import NewParagraphTable from "./NewParagraphTable";
// import { useDispatch } from "react-redux";
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
    NewTable,
    Popupcard,
} from "../../Components/CommonImports/CommonImports";
import { Alert } from "reactstrap";


export default function NewParagraph({
    selectedItem,
    isPara,

    onCancel,
    template,
    validate,
    onSubmit,

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
    const [pargraph, setParagraph] = useState([]);
    const [defaultValues, setDefaultValues] = useState({});

    const loadDocuments = useCallback(async () => {
        const res = await get(api + "/document/getAll/document?t=" + Date.now());
        if (response.ok) {
            SetDocuments(res)
            console.log("res for load doc", res)
        }
        else {
            console.log("failed to load", response)
        }

    }, [response]);

    useEffect(() => {
        loadDocuments();
    }, [loadDocuments]);





    const deleteDocument = async (item) => {
        console.log("item ", item)
        const deleted = await del(`${api}/paragraph/delete/${item.paragraphId}`);
        console.log("deleted::" + deleted);
        if (response.ok) {

            console.log("resp==>,", response)

            AlertHandler("pargraph is  deleted ", "success");
            setParagraph((prev) => prev.filter((c) => c.paragraphId !== item.paragraphId));
        } else {
            console.log("resp==>,", response)
            AlertHandler("Failed to delete paragraph", "danger");
        }
    };


    const showFormHandler = (item, action) => () => {
        if (action === "Edit") {
            console.log("Edit clicked:", item);

            setDefaultValues(item);
        }
        if (action === "Delete") {
            deleteDocument(item);
        }
    };
    const loadParagraph = useCallback(async () => {

        const res = await get(`${api}/paragraph/getAll/${selectedItem.documentId}?t=${Date.now()}`); if (response.ok) {
            const result = Array.isArray(res) ? res : [];
            setParagraph(result)
            // AlertHandler("")
            console.log("res for load para", res)
        }
        else {
            console.log("failed to load para", response)
        }

    }, [get, selectedItem?.documentId, response.ok]);

    useEffect(() => {
        loadDocuments();
        loadParagraph()
    }, [loadDocuments, loadParagraph]);

    const savePargaraph = useCallback(async (value) => {

        console.log("vaues for save para", value)
        const val = {
            ...value,
            documentId: selectedItem.documentId
        }
        console.log("value fro save the para val:", val)
        const res = await post(api + "/paragraph/create", val);
        if (response.ok || res) {
            AlertHandler(
                value.paragraphId ? "Paragraph updated successfully" : "Paragraph added successfully",
                "success"
            );
            setDefaultValues({});
            await loadParagraph();

        } else {
            console.error("Save failed:", response);
            AlertHandler("Failed to save paragraph", "danger");

        }
    }, [post, response.ok, selectedItem.documentId, loadParagraph]);

    const actions = ["Edit", "Delete"];
    return (
        <div className={classes.container}>
            <Popupcard
                title="Add Paragraph" showBack onBack={onCancel}
            >

                <CreateForm
                    template={template}
                    rowwise={3}
                    defaultValues={defaultValues}
                    onSubmit={savePargaraph}
                    onCancel={onCancel}
                    buttonName="Add"
                    validate={validate}
                />
                {isPara && (
                    <NewTable
                        cols={NewParagraphTable(showFormHandler, actions)}

                        data={pargraph}
                        striped
                        title="Paragraph"
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
                    />)}

            </Popupcard>
        </div>
    );
}
