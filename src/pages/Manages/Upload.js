import React, { useState, useEffect, useCallback } from 'react';
import SearchCard from '../../UI/cards/SearchCard';
import CreateForm from '../../Components/Forms/CreateForm';
import classes from '../Master/Master.module.css';
import { useSelector, useDispatch } from "react-redux";
import { alertActions } from '../../store/alert-slice';
import { modalActions } from '../../store/modal-Slice';
import api, { downloadLink } from '../../Api';
import useFetch, { Provider } from "use-http";
import Popupcard from '../../UI/cards/Popupcard';
import UploadTable from './UploadTable';
import PopupSimpleCard from '../../UI/cards/PopupSimpleCard';
import Table from '../../Components/tables/Table';
import { NewTable } from '../../Components/CommonImports/CommonImports';
import { saveAs } from 'file-saver';

const rowWiseFields = 3;
const rowcolumns = [2, 2, 3, 3, 3];
function Upload(props) {
    const getDynamicFinancialYear = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();

        let startYear, endYear;

        if (month < 4) {
            startYear = year - 1;
            endYear = year;
        } else {
            startYear = year;
            endYear = year + 1;
        }
        const startStr = startYear.toString().slice(-2);
        const endStr = endYear.toString().slice(-2);

        return startStr + endStr;
    }
    const dynamicFY = getDynamicFinancialYear();

    const { referenceId, referenceType, uploadTitle } = props;
    // const { regionId, uploadTitle, action } = props;

    const { get, post, del, put, response, loading, error } = useFetch({ data: [] });
    const [defaultValues, setDefaultValues] = useState({});
    const [data, setData] = useState([]);
    const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
    ]);

    const [showModal, selectedForm, selectedData, modalWidth, modalLeft] = useSelector((state) => [
        state.modalProps.showModal,
        state.modalProps.selectedForm,
        state.modalProps.selectedData,
        state.modalProps.modalWidth,
        state.modalProps.modalLeft,
    ]);

    const dispatch = useDispatch();
    const AlertHandler = (alertContent, alertType) => {
        dispatch(
            alertActions.showAlertHandler({
                showAlert: !showAlert,
                alertMessage: alertContent,
                alertVariant: alertType,
            })
        );
    };

    const actions = ["Priceupload", "TermsUpload"];
    // const showFormHandler = (item, action) => () => { }

    const template = {
        fields: [

            {
                title: "Upload Document",
                type: "Document",
                name: "file",
                contains: "Document",
                inpprops: {
                    md: 4,
                },
            },
            {
                title: "description",
                type: "textarea",
                name: "description",
                contains: "textarea",
                validationProps: "description is required",
                inpprops: {
                    md: 4
                },
            },


        ],
    };


    const loadInitialData = useCallback(async () => {
        const payload = { id: referenceId, docType: referenceType, random: Math.random() };
        // const result = await get(api + `/docsUpload/getUploadedFiles/${referenceId}`);
        const result = await get(`${api}/docsUpload/getUploadedFiles/${referenceId}?t=${Date.now()}`);
        // const result = await post(api + `/docsUpload/getDocsById`, payload);
        if (response.ok && result) {
            setData(result);
        }
        else {
            setData([]);
        }
    }, [referenceId, referenceType, post, response]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const handleDownload = async (rowData) => {
        try {

            const res = await get(api + `/docsUpload/download/${rowData.generatedFileName}`);
            if (response.ok) {
                const blob = await response.blob();
                saveAs(blob, rowData.fileName);
            } else {
                AlertHandler("Failed to download file", "danger");
            }
        } catch (err) {
            console.log(err);
        }
    };
    const handleDelete = async (rowData) => {
        const res = await post(api + `/docsUpload/deleteDocs`, rowData);
        if (response.ok) {
            setData(prev => prev.filter(item => item.docsId !== rowData.docsId));
            AlertHandler("Document Deleted Successfully", "success");
        } else {
            AlertHandler("Failed to delete document", "danger");
        }
    };
    const showFormHandler = (item, action) => () => {
        if (action === "view") {
            handleDownload(item);
        } else if (action === "delete") {
            handleDelete(item);
        }
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }
    async function onSubmit(values) {
        const formData = new FormData();
        formData.append("file", values.file[0]);
        formData.append("referenceId", referenceId);
        formData.append("remarks", values.description);
        formData.append("referenceType", referenceType);
        // formData.append("financialYear", dynamicFY)
        formData.append("financialYear", new Date().toISOString().split('T')[0]);
        const res = await post(api + "/docsUpload/uploadFile", formData);
        console.log("formadata..", formData)
        if (response.ok && res.retValues && res.retValues.status === 1) {
            console.log("resp is ok..", res)
            AlertHandler(res.retValues.message, "success");
            setData(prev => [...prev, res.retValues.invoiceDocs]);
        } else {
            console.log("res is failed ,,", res)
            AlertHandler("Upload Failed", "danger");
        }
    }

    return (
        <div className={classes.container}>
            <Popupcard
                title={uploadTitle}
                showBack onBack={props.onCancel}


            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    // rowcolumns={rowcolumns}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    defaultValues={defaultValues}
                    buttonName="Save"

                ></CreateForm>
                <PopupSimpleCard>

                    <NewTable cols={UploadTable(showFormHandler, actions)}
                        data={data} striped
                        rows={10} />
                </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default Upload;


