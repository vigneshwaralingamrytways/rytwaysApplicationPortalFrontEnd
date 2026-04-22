import React, { useState, useEffect, useCallback } from 'react';

import FileUploadTable from './Table/CommonFileUploadTable'


import {

    SearchCard,Popupcard,SimpleCard,PopupSimpleCard,CreateForm,Table,alertActions,modalActions,useSelector,useDispatch,api,downloadLink,useFetch,Provider,classes,Row, Button, NavCreateForm
    } from '../CommonImports/CommonImports'

const rowWiseFields = 2;

function UploadForm(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
    const [data,setData]=useState([{
        documentname: 'Document 1',
      // Add other properties as needed
    },])
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


    const actions = ["Add","AddBooking","status","payment","document"];
    const showFormHandler = (item, action) => () => {
      console.log(action);
      
    };

    const template = {
        fields: [

            {
                title: "Document Name",
                type: "text",
                name: "documentname",
                contains: "text",
                inpprops: {
                    md:4,
                },
            },
            {
                title: "Upload Document",
                type: "Document",
                name: "qrcode",
                contains: "Document",
                inpprops: {
                    md:8,
                  },
              }
        ],
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

    function onSubmit(values) {
        console.log(values);


    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="File Uploaded"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>

<PopupSimpleCard>
    
    <Table cols={FileUploadTable(showFormHandler, actions)} 
data={data}   striped
       rows={10} /> </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default UploadForm;


