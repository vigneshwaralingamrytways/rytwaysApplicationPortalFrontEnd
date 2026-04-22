import React, { useState, useEffect, useCallback } from 'react';
import SearchCard from '../../UI/cards/SearchCard';
import CreateForm from '../../Components/Forms/CreateForm';
import classes from './Master.module.css';
import { useSelector, useDispatch } from "react-redux";
import { alertActions } from '../../store/alert-slice';
// import { modalActions } from '../../../store/modal-Slice';
import api, { downloadLink } from '../../Api';
import useFetch, { Provider } from "use-http";
import Popupcard from '../../UI/cards/Popupcard';


const rowWiseFields = 3;

function NewDepartment(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
    const [data,setData]=useState([])
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
        title: "Department Name",
        type: "text",
        name: "departmentName",
        contains: "text",
        inpprops: {
          minlength: 4,
          maxlength: 80,
        },
      },
      {
        title: "Department Head",
        type: "text",
        name: "departmentHead",
        contains: "text",
        inpprops: {
          minlength: 4,
          maxlength: 80,
        },
      },
      {
        title: "Ass Department Head",
        type: "text",
        name: "assDepartmentHead",
        contains: "text",
        inpprops: {
          minlength: 4,
          maxlength: 80,
        },
      },
      {
        type: "hidden",
        name: "departmentId",
        contains: "text",
        inpprops: {
         
        },
      },
      
    ],
  };
    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

    async function onSubmit(values) {
        props.departmentSave({...values});
      }
    

    return (
        <div className={classes.container}>
            <Popupcard
                title="Add Department" 
                showBack onBack={props.onCancel}

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
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

export default NewDepartment;


