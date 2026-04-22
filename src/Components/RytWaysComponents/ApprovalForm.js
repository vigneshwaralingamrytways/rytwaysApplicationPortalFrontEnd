import React, { useState, useEffect, useCallback } from 'react';

import { useForm } from 'react-hook-form';


import {

  Popupcard,SearchCard,SimpleCard,CreateForm,Table,alertActions,modalActions,useSelector,useDispatch,api,downloadLink,useFetch,Provider,classes,Row, Button, NavCreateForm, PopupSimpleCard
  } from '../../Components/CommonImports/CommonImports'
import ApprovalTable from '../RytWaysComponents/Table/ApprovalTable'

const rowWiseFields = 2;


function ApprovalForm(props) {
  const { register, setValue, getValues } = useForm();
  const [data, setData] = useState('');
  const [operationOptions, setOperationOptions] = useState([ { value: "", label: "Select" }]);
  const [selectedData,setSelectedData] = useState("")
  const { get, post, response, loading, error } = useFetch();
  const [appHist,setAppHist]=useState([])
  const[showApproval,setShowApproval] = useState(false)
  const[approval,setApproval]=useState({})
  
  const loadInitialCustomers = useCallback(async () => {
    // const { ok } = response // BAD, DO NOT DO THIS
    const loadedcusts = await post(api+"/approvalHist/listApprovals",{processName:props.processName,approvalProcessId:props.processId,random:Math.random()});
    //const loadedinputSheets = await get(api+"/inputSheet/sheets");
    console.log(loadedcusts)
    setAppHist([...loadedcusts]);
    // if(loadedinputSheets.length>=1){
    //   setInputSheets(loadedinputSheets)
    // }
    console.log({...props.selectedItem})
  }, []);

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  const [showModal, selectedForm, selectedData1] = useSelector((state) => [
    state.modalProps.showModal,
    state.modalProps.selectedForm,
    state.modalProps.selectedData,
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

   useEffect(() => { loadInitialCustomers() }, [])
  const template = {
   // heading: props.title,
     fields: [
    
        {
            title: "Status",
            type: "select",
            name: "status",
            contains: "select",
            validationProps: "Status is required",
            options:[
                {value:"", label:'Select'},
                {value:'Approved', label:'Approved'},
                {value:'Reject', label:'Reject'}
              ]},    
      {
        title: 'Remarks',
        type: 'textarea',
        name: 'approverRemarks',
        contains:"textarea",
        inpprops:{
          maxlength:128,
          md:6
        },
         },{
          type: 'hidden',
          name: 'approvedBy',
          contains:"hidden",
          value:localStorage.userId,
          inpprops:{
            maxlength:128,
            md:6
          },
           }
      ],
};
function validate(watchValues, errorMethods) {
  let { errors, setError, clearErrors } = errorMethods;
//[2,5]
   // Firstname validation
   if(watchValues[0] != "" && watchValues[0] !=selectedData){
    
     
     // console.log("demo",watchValues[0]);
  }
 
}

const saveApproval = async (pr) => {
  //  procMaps
  const orderapi = "/approvalHist/update";
  const returnObject = await post(api + orderapi, pr);
  console.log(returnObject);
  if (returnObject.retValues.status == 1) {
      dispatch(modalActions.hideModalHandler());
      AlertHandler(returnObject.retValues.message, "success");
    } else {
    dispatch(modalActions.hideModalHandler());
    AlertHandler(returnObject.retValues.message, "danger");
  }
};

const showFormHandler = (item) => () => {
        setShowApproval(true)
        setApproval(item)
}
function onSubmit(values) {
        if(values.status==='Approved'){
          values.approvalHistoryId = approval.approvalHistoryId
          values.isApproved =1
      }else{
        values.approvalHistoryId = approval.approvalHistoryId
        values.isCancelled =1
      }
      console.log(approval)
      saveApproval(values)
    }

  return (<>
  <Popupcard title={props.title}>
    
    {showApproval && 
    <>
    {props.approvalForm}
    <CreateForm  template={template}
    rowwise={rowWiseFields}
    watchFields={[]}
    validate={validate}
    onSubmit={onSubmit} 
    onCancel={props.onCancel}
    buttonName="Save"
    >
    </CreateForm>
    </>
    }  <PopupSimpleCard md={12}>
      { !showApproval && <Table
          cols={ApprovalTable(showFormHandler,localStorage.userId,localStorage.roleId,localStorage.departments)}
          data={appHist}
          rows={10}
         
        />}
      </PopupSimpleCard>
      </Popupcard> </>
  )
}

export default ApprovalForm



  
  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;
  
    // Firstname validation
    if(watchValues['firstname'] === 'Admin'){
        if(!errors['firstname']){
            setError('firstname', {
                type: 'manual',
                message: 'You cannot use this first name'
            })
        }
    }else{
        if(errors['firstname'] && errors['firstname']['type'] === 'manual'){
            clearErrors('firstname');
        }
    }
  }
  
