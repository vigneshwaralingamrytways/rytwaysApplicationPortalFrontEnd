import React, { useState, useEffect, useCallback } from 'react';



import {

  Popupcard,SearchCard,SimpleCard,CreateForm,Table,alertActions,modalActions,useSelector,useDispatch,api,downloadLink,useFetch,Provider,classes,Row, Button, NavCreateForm, PopupSimpleCard
  } from '../CommonImports/CommonImports'
import ApprovalTable from './Table/ApprovalTable'



const rowWiseFields = 2;


function ApprovalForm(props) {


 const {orderItems, defvalues} = props;
 const[data,setData]=useState([
  {
    "approvedby":"Approved",
    "approvedon":"value",
    "remark":"remark",
  }
 ])
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


    const actions = ["Status"];
  const showFormHandler = (item, action) => () => {
    console.log(action);
   
      
  };
  

  const template = {
    fields: [
    
      {
        title: "Status",
        type: "select",
        name: "orderStatusId",
        contains: "Select",
        options: [
          { value: "Select", label: "Select" },
          { value: 1, label: "New" },
          { value: 2, label: "Approved" },
          { value: 3, label: "Cancelled" },
          { value: 4, label: "In Production" },
          { value: 5, label: "Closed" },
          
        ],
      },
      {
        title: "Remarks",
        type: "text",
        name: "remarks",
        contains: "text",
      //  validationProps: "projectDescribtion is required",
        inpprops: {
          
        },
    },
    ],
  };
    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

 
      function onSubmit(values) {
        // Include RegionName and unitName in the status data

        props.orderSave({
            id: values.id,
            orderStatusId: values.orderStatusId,
            remarks: values.remarks,
              },"status");
    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Approval"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={defvalues}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>
     <PopupSimpleCard >
   
   <Table cols={ApprovalTable(showFormHandler, actions,localStorage.userId,localStorage.roleId,localStorage.departmentIds)}
             data={data} 
             striped
            
              /> 
         </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default ApprovalForm;




