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
import UploadPaymentTable from './UploadPaymentTable';
import PopupSimpleCard from '../../UI/cards/PopupSimpleCard';
import Table from '../../Components/tables/Table';
import { NewTable } from '../../Components/CommonImports/CommonImports';


const rowWiseFields = 3;
const rowcolumns = [2, 2, 3, 3, 3];
function UploadPayment(props) {



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

    const actions = ["paymentupload", "TermsUpload"];
    const showFormHandler = (item, action) => () => { }

    const template = {
        fields: [

            {
                title: "Upload File",
                type: "Document",
                name: "file",
                contains: "Document",
                inpprops: {
                    md: 4,
                },
            },
            {
                title: "Desc",
                type: "textarea",
                name: "projectDescribtion",
                contains: "textarea",
                validationProps: "payment Describtion is required",
                inpprops: {
                    md: 4
                },
            },
            // {
            //     type: "hidden",
            //     name: "id",
            //     contains: "text",
            //     inpprops: {
                   
            //     },
            // },

        ],
    };


    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }
    async function onSubmit(values) {


        props.saveDetails({ ...values }, action);
    }

    return (
        <div className={classes.container}>
            <Popupcard
                title={" Upload"}

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

                    <NewTable cols={UploadPaymentTable(showFormHandler, actions)}
                        data={data} striped
                        rows={10} />
                </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default UploadPayment;


