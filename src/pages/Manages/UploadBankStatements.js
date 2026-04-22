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
import UploadBankStatementsTable from './UploadBankStatementsTable';


const rowWiseFields = 3;
const rowcolumns = [2, 2, 3, 3, 3];
function UploadBankStatements(props) {



    const { regionId, uploadTitle, action } = props;

    const { get, post, response, loading, error } = useFetch({ data: [] });
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
    const showFormHandler = (item, action) => () => { }

    const template = {
        fields: [

            {
                title: "Upload Bank Statements",
                type: "Document",
                name: "file",
                contains: "Document",
                inpprops: {
                    md: 4,
                },
            },
            {
                title: "Month ",
                type: "select",
                name: "month",
                contains: "number",
                validationProps: "monthis required",
                inpprops: {
                    md: 4
                },
                options: [
                    { label: "January", val: "01" },
                    { label: "February", val: "02" },
                    { label: "March", val: "03" },
                    { label: "April", val: "04" },
                    { label: "May", val: "05" },
                    { label: "June", val: "06" },
                    { label: "July", val: "07" },
                    { label: "August", val: "08" },
                    { label: "September", val: "09" },
                    { label: "October", val: "10" },
                    { label: "November", val: "11" },
                    { label: "December", val: "12" },
                ],
            },
            {
                title: "Year ",
                type: "select",
                name: "year",
                contains: "number",
                validationProps: "year is required",
                inpprops: {
                    md: 4
                },

                options: [
                      { label: "2024", val: "12024" },
                    { label: "2025", val: "20251" },
                    { label: "2026", val: "2026" },
                ],
            },



        ],
    };


    function validate() {
      




    }
    async function onSubmit(values) {


        props.saveDetails({ ...values }, action);
    }

    return (
        <div className={classes.container}>
            <Popupcard
                title={" Upload Bank Statement"}
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

                    <NewTable cols={UploadBankStatementsTable(showFormHandler, actions)}
                        data={data} striped
                        rows={10} />
                </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default UploadBankStatements;


