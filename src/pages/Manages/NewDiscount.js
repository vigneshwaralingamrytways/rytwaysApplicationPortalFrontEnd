import React, { useState, useEffect, useCallback, useRef } from 'react';
 import CreateForm from '../../Components/Forms/CreateForm';
import classes from '../Master/Master.module.css';
import { useSelector, useDispatch } from "react-redux";
import { alertActions } from '../../store/alert-slice';
 
import useFetch, { Provider } from "use-http";
import Popupcard from '../../UI/cards/Popupcard';
 


const rowWiseFields = 1;
const rowcolumns = [2, 2, 3, 3, 3];
function NewDiscount(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
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




    const template = {
        fields: [
            {
                title: "Upload Document",
                type: "Document",
                name: "file",
                contains: "Document",
                inpprops: {
                    md:4,
                  },
              },
          {
            type: "hidden",
            name: "id",
            contains: "text",
            inpprops: {
              minlength: 0,
              maxlength: 999999,
            },
          },
          
        ],
      };
      
    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }
    async function onSubmit(values) {
        //props.regionSave({...values});
       // setda [...regions, newRegion]
      }
    
    return (
        <div className={classes.container}>
            <Popupcard
                title="Discount"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                   // rowcolumns={rowcolumns}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    defaultValues={props.selectedItem}
                    buttonName="Save"

                ></CreateForm>
            </Popupcard>

        </div>
    );
}

export default NewDiscount;


