import React, { useCallback, useEffect, useState } from 'react';

import {
    CreateForm,
    SimpleCard,
    Table,
    alertActions,
    api,
    modalActions,
    useDispatch,
    useFetch,
    useSelector
} from '../../../Components/CommonImports/CommonImports';
import QueryCommentsTable from '../QueryCommentsTable';
import { generateToken } from '../../../Components/GenerateToken';
import AddActivityWiz from './Popup/AddActivityWiz';
import ProcCommWiz from './Popup/ProcCommWiz';
import AddStatusWiz from './Popup/AddStatusWiz';

import classes from "../../../Components/Wizard.module.css";
import * as FaIcons from "react-icons/fa";
import UploadFormWiz from './UploadFormWiz';
import EditFunction from '../../../Components/SlidingMenu/EditFunction';




const rowWiseFields = 1;
const rowWiseFieldsTwo = 3;
const rowColors = ["#fff"];
function FunctionWiz(props) {


//const selectedItem = JSON.parse(props.location.state.selectedItem);

    const { get, post, response, loading, error } = useFetch({ data: [] });
    const activityId = useSelector((state) => state.sideBar.activityId);

    const [data,setData] = useState ([]);
    const [defaultValues,setDefaultValues] = useState({});
    const [orderItems, setOrderItems] = useState([]);
    const [step, setStep] = useState(1);
   const [prevWatchValues, setPrevWatchValues] = useState([]);
   const [issueId, setIssueId] = useState("");
   const [commentStatus,setCommentStatus]=useState([{ value: "", label: "Select" }]);
   const [commentType,setCommentType]=useState([{ value: "", label: "Select" }]);
   const [initStatus,setInitStatus]=useState([{ value: "", label: "Select" }]);
   const functionId = useSelector((state) => state.sideBar.moduleId);
  const functionPath = useSelector((state) => state.sideBar.functionPath);
  const processTittle = useSelector((state) => state.sideBar.processTittle);
  const functionTittle = useSelector((state) => state.sideBar.functionTittle);

   
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

   
    const actions = ["functionForm", "processComments", "status", "upload", "commentUpload", "edit"];
    const showFormHandler = (item, action) => () => {
      console.log(action);
      if (action === "functionForm") {
        dispatch(
          modalActions.showModalHandler({
            selectedData: { ...item },
            modalWidth: '48%',
            modalLeft: '26%',
            selectedForm: (
              <AddActivityWiz
                onCancel={()=>dispatch(modalActions.hideModalHandler())}
                selectedItem={{...item}}
                
                // saveFunction = {formSaveFunction}
            
              />
            ),
            showModal: true,
          })
        );
      }else if (action === "processComments") {
        dispatch(
          modalActions.showModalHandler({
            selectedData: { ...item },
            modalWidth: '48%',
            modalLeft: '26%',
            selectedForm: (
              <ProcCommWiz
                onCancel={()=>dispatch(modalActions.hideModalHandler())}
                selectedItem={{...item}}
                commentType={commentType}
                onSubmitTwo={onSubmitTwo}
                // saveFunction = {formSaveFunction}
            
              />
            ),
            showModal: true,
          })
        );
      }else if (action === "status") {
        dispatch(
          modalActions.showModalHandler({
            selectedData: { ...item },
            modalWidth: '24%',
            modalLeft: '38%',
            selectedForm: (
              <AddStatusWiz
                onCancel={()=>dispatch(modalActions.hideModalHandler())}
                selectedItem={{...item}}
                onSubmitTwo={onSubmitTwo}
                commentStatus={commentStatus}
                // saveFunction = {formSaveFunction}
            
              />
            ),
            showModal: true,
          })
        );
      }else if (action === "upload") {
        dispatch(
          modalActions.showModalHandler({
            selectedData: { ...item },
            
            selectedForm: (
              <UploadFormWiz
                onCancel={()=>dispatch(modalActions.hideModalHandler())}
                selectedItem={{...item}}
                onSubmitTwo={onSubmitTwo}
                commentStatus={commentStatus}

                reportType={"FUNCTION"}
                filePath={"FUNCTION/"}
                docId={functionId}

                // saveFunction = {formSaveFunction}
            
              />
            ),
            showModal: true,
          })
        );
      }else if (action === "commentUpload") {
        dispatch(
          modalActions.showModalHandler({
            selectedData: { ...item },
            
            selectedForm: (
              <UploadFormWiz
                onCancel={()=>dispatch(modalActions.hideModalHandler())}
                selectedItem={{...item}}
                onSubmitTwo={onSubmitTwo}
                commentStatus={commentStatus}
                reportType={"COMMENT"}
                filePath={"COMMENT/"}
                docId={item.commentId}
                // saveFunction = {formSaveFunction}
            
              />
            ),
            showModal: true,
          })
        );
      }if (action === "edit") {
        dispatch(
          modalActions.showModalHandler({
            selectedData: { ...item },
            modalWidth: '48%',
            modalLeft: '26%',
            selectedForm: (
              <EditFunction
                onCancel={()=>dispatch(modalActions.hideModalHandler())}
                selectedItem={{...item}}
                
                 saveFunction = {editFunction}
            
              />
            ),
            showModal: true,
          })
        );
      }
    } 
    
    

    const template = {
        fields: [

       
{  /* legend: `${functionTittle || "Details"}`, */
title: "Current Practice",
type: "richtext",
name: "currentProblem",
contains: "richtext",
//validationProps: "projectDescribtion is required",
inpprops: {
    // md: 3
},
},
{  /* legend: `${functionTittle || "Details"}`, */
title: "Solution",
type: "richtext",
name: "solution",
contains: "richtext",
//validationProps: "projectDescribtion is required",
inpprops: {
    // md: 3
},
},{ /*  legend: `${processTittle || "Details"}`, */

title: "Data Point",
type: "richtext",
name: "dataPoints",
contains: "richtext",
//validationProps: "projectDescribtion is required",
inpprops: {
    // md: 3
},
},{ /*  legend: `${processTittle || "Details"}`, */

title: "Controlls And Policy",
type: "richtext",
name: "controls",
contains: "richtext",
//validationProps: "projectDescribtion is required",
inpprops: {
    // md: 3
},
},{   
  title: "Status",
  type: 'select',
      name: 'issueStatus',
      contains: 'Select',
      options: initStatus,
      validationProps: "Value is required",
  }
  


        ],
    };
   

    const templateTwo = {
      fields: [

        {   legend:"Comments Details",
        title: "Type",
        type: 'select',
            name: 'commentType',
            contains: 'Select',
            options: commentType,
            validationProps: "Value is required",
        },{   legend:"Comments Details",
title: "Comment",
type: "textarea",
name: "issueComments",
contains: "textarea",

inpprops: {md:8},
},


      ],
  };
 
  const loadInitialCustomers = useCallback(async () => {
    // const { ok } = response // BAD, DO NOT DO THIS
     const initialUnit = await post(api+"/issueSolution/loadIssueSolutionWithComments",{"issueType":"Function","functionActivityId":functionId, "random":generateToken()});
     const loadQueryStatus = await post(api+"/queryStatus/loadOptions",{"statusType":"COMMENTS","random":generateToken()});
     const loadType = await post(api+"/commentType/loadOptions",{"random":generateToken()});
     const loadStatus = await post(api+"/queryStatus/loadOptions",{"statusType":"FUNCTION","random":generateToken()}); 

     if(loadQueryStatus.length > 0){
        setCommentStatus([...commentStatus,...loadQueryStatus])
     }
     if(loadType.length > 0){
      setCommentType([...commentType,...loadType])
   }
   if(loadStatus.length > 0){
    setInitStatus([...initStatus,...loadStatus])
 }
       if (response.ok){

     setDefaultValues(initialUnit)
     setOrderItems(initialUnit?.commentList || []);
     setIssueId(initialUnit?.issueId || "");
   //  setQuality([...quality,...initialQuality]);
   

    }
  }, [get, response, functionId]);
  
  useEffect(() => { loadInitialCustomers() }, [loadInitialCustomers]) // componentDidMount

  



    function validate(watchValues, errorMethods) {
      let { errors, setError, clearErrors } = errorMethods;
  
      if (
        watchValues.some(
          (value, index) =>
            value !== prevWatchValues[index] &&
            value !== "" &&
            value !== undefined
        )
      ) {
     
        setPrevWatchValues([...watchValues]);
      }
    }
    
   
const  saveFunction = async (values)=>{

  const newTransac = await post(api+"/issueSolution/create"  , {...values,random:generateToken()})
 
 if (response.ok) {
    setIssueId(newTransac?.issueId || "");
setDefaultValues(newTransac)
    dispatch(modalActions.hideModalHandler())
    AlertHandler("Query Saved Successfully","success")
    
    }else{
    dispatch(modalActions.hideModalHandler())
    AlertHandler("Query Failed To Save","danger")
     
    }
    
    }

    const editFunction = async(values)=>{


      const saveUrl = values.functionId > 0 ? '/functionMaster/edit': '/functionMaster/create'
  
      const newDoc = await post(api+saveUrl, values)
  
      if (response.ok) {

          // setDefaultValue({})

        if(values.functionId){
          // setData(data.map((doc) => doc.functionId === values.functionId ? values : doc))
         // dispatch(modalActions.hideModalHandler())
          AlertHandler("Function Updated Successfully","success")
        }else{
          // setData([...data, newDoc])
        //  dispatch(modalActions.hideModalHandler())
          AlertHandler("Function Created Succesfully","success")
        }
      }else{
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Function Details Failed To Save","danger")
      }
    }
const saveOrder = async (values) => {
  const newTransac = await post(api+"/issueSolution/createComments"  , values)
  
    
    if(response.ok){
    setOrderItems([...orderItems, newTransac]);
    dispatch(modalActions.hideModalHandler())
AlertHandler("Comments Saved Successfully","success")

}else{
dispatch(modalActions.hideModalHandler())
AlertHandler("Comments Failed To Save","danger")
 
}
};

    function onSubmit(values) {
      console.log(" values ====>", values);
      values.issueType="Function"
      values.functionActivityId=functionId;
      saveFunction(values)
  }
  
  function onSubmitTwo(values) {
    console.log(values);
    values.issueId=issueId
    
    saveOrder(values)
}

const steps = [
    { title: "Current Practice", icon: <FaIcons.FaUser color="#474746" /> },
    { title: "Comments", icon: <FaIcons.FaUser color="#474746" /> },
    /* { title: "Last step", icon: <FaIcons.FaUser color="#474746" /> }, */
  ];
  
  const handleNext = () => step < steps.length && setStep(step + 1);
  const handleBack = () => step > 1 && setStep(step - 1);
  
  const renderContent = () => {
    switch (step) {
      case 1:
        return <div>
        
        
        <CreateForm
                         template={template}
                         rowwise={rowWiseFields}
                         rowColors={rowColors}
                       //   watchFields={[""]}
                         validate={validate}
                         onSubmit={onSubmit}
                         onCancel={props.onCancel}
                         defaultValues={defaultValues}
                        /*  btButtons={<OrderItems
                           saveOrder={saveOrder}
                           orderItems={orderItems}
                          
                        
                          
                           />} */
                         buttonName="Save"
                         
                     ></CreateForm>
                     {/*
   <details  style={{ backgroundColor: 'white' }}>
     <summary>Instructions: ALL FIELDS ARE IMPORTANT AND NEEDS TO BE FILLED IN ORDER TO PROCESS THE ORDER</summary>
     
   </details>
   
                         */}
       </div>;
      case 2:
        return <div>
         {<Table
            cols={QueryCommentsTable(showFormHandler, actions)}
            data={orderItems}
            rows={10}
           
           
          />}</div>;
      case 3:
        return <div><h3>Last Step</h3><p>Some content for the last step</p></div>;
      default:
        return null;
    }
  };
  
  const totalSteps = steps.length;
  const completedPercent = ((step - 1) / (totalSteps - 1)) * 100;
  
  const handleAddClick = () => {
    // Placeholder for popup logic
    alert("Add icon clicked! Open popup here.");
  };
  
  return (
      <div className={classes.wizardContainer}>
      {/* Global Add Icon (top-right corner of the page) */}
     

<div className={classes.iconTopRightGroup}>
        <FaIcons.FaUpload
        color="#00aaff"
          className={classes.uploadIconTopRight}
          onClick={showFormHandler({functionId:functionId},actions[3])}
        />
        <FaIcons.FaPlusCircle
          className={classes.addIconTopRight}
          color="#00aaff"
          
          onClick={showFormHandler({functionId:functionId},actions[0])}
        />
      </div>
  
      <div className={classes.stepper}>
        <div className={classes.stepLineTrack}></div>
        <div
          className={classes.stepLineOverlay}
          style={{ width: `${completedPercent}%` }}
        ></div>
  
        {steps.map((s, index) => {
          const current = index + 1;
          const isActive = step === current;
          return (
            <div
              className={classes.stepItem}
              key={current}
              onClick={() => setStep(current)}
              style={{ cursor: "pointer" }}
            >
              <div
                className={`${classes.stepIcon} ${
                  isActive ? classes.activeIcon : ""
                }`}
              >
                {s.icon}
              </div>
              <div
                className={`${classes.stepLabel} ${
                  isActive ? classes.activeLabel : ""
                }`}
              >
                {s.title}
              </div>
            </div>
          );
        })}
      </div>
  
      <div className={classes.wizardCard}>
        <div className={classes.greenHeader}>
          {` ${processTittle} / ${functionTittle}`}
          {step === 1 && (
            <FaIcons.FaEdit
              className={classes.addIconInside}
             /*  onClick={handleAddClick} */
             onClick={showFormHandler({functionId:functionId},actions[5])}
            />
          )}

          {/* Add icon only for step 2 (Administration) */}
          {step === 2 && (
            <FaIcons.FaPlusCircle
              className={classes.addIconInside}
             /*  onClick={handleAddClick} */
             onClick={showFormHandler({functionId:functionId},actions[1])}
            />
          )}
        </div>
  
        <div className={classes.stepContent}>{renderContent()}</div>
      </div>
  
      <div className={classes.stepButtons}>
        <button onClick={handleBack} disabled={step === 1}>
          Back
        </button>
        <button onClick={handleNext} disabled={step === totalSteps}>
          Next
        </button>
      </div>
    </div>
  );
  };
  
export default FunctionWiz;


