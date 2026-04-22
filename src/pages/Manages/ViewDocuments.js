import React, { useState, useCallback, useEffect } from "react";
import NewTable from "../../Components/NewTable/NewTable";
import { api, useFetch } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";
import {
    alertActions,
    useSelector,
    useDispatch,
    Popupcard,
} from "../../Components/CommonImports/CommonImports";
import ViewdDocumentsTable from "./ViewDocumentsTable";
import { saveAs } from 'file-saver';

const ViewDocuments = ({ document, onCancel }) => {
    const { get, response } = useFetch({ data: [] });
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
    const loadDocuments = useCallback(async () => {


        const res = await get(api + "/document/getAll/document");
        if (response.ok) {
            const result = Array.isArray(res)
                ? res.filter(doc => doc.isPdfGenerated === true)
                : [];
            SetDocuments(result)
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


    const handleDownload = async (rowData) => {
        try {
            const res = await get(api + `/document/download/${rowData.documentId}`);
            if (response.ok) {
                const blob = await response.blob();
                saveAs(blob, `${rowData.documentTitle}.pdf`);
            } else {
                AlertHandler("Failed to download file", "danger");
                console.log("fail to docnlods", response)
            }
        } catch (err) {
            console.log("errors,", err);
        }
    };

    const showFormHandler = (rowData) => () => {
        handleDownload(rowData);
    };

    return (
        <div className={classes.container}>
            {/* <Popupcard title={"View Document"}> */}
            <NewTable
                title="Document Details"
                data={documents}
                cols={ViewdDocumentsTable(showFormHandler)}
                //   rows={1}
                showFilterIcon={false}
            />

            {/* </Popupcard> */}
        </div>
    );
};

export default ViewDocuments;
