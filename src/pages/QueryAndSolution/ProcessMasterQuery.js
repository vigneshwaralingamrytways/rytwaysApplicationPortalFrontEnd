import React, { useCallback, useEffect, useState } from 'react';

import {
    CreateForm,
    SimpleCard,
    Table,
    alertActions,
    api,
    classes,
    modalActions,
    useDispatch,
    useFetch,
    useSelector
} from '../../Components/CommonImports/CommonImports';
import QueryCommentsTable from './QueryCommentsTable';
import { generateToken } from '../../Components/GenerateToken';




const rowWiseFields = 1;
const rowWiseFieldsTwo = 3;
const rowColors = ["#fff"];
function ProcessMasterQuery(props) {


//const selectedItem = JSON.parse(props.location.state.selectedItem);

    const { get, post, response, loading, error } = useFetch({ data: [] });
    const activityId = useSelector((state) => state.sideBar.activityId);

    const [data,setData] = useState ([]);
    const [defaultValues,setDefaultValues] = useState({});
    const [orderItems, setOrderItems] = useState([]);
   
   const [prevWatchValues, setPrevWatchValues] = useState([]);
   const [issueId, setIssueId] = useState("");
   

   const processId = useSelector((state) => state.sideBar.moduleId);
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

   
     const actions = ["Instruction"];
    const showFormHandler = (item, action) => () => {
      console.log(action);
      if (action === "Instruction") {
       /*  dispatch(
          modalActions.showModalHandler({
            selectedData: { ...item },
            modalWidth: '68%',
            modalLeft: '16%',
            selectedForm: (
              <Instruction
                onCancel={()=>dispatch(modalActions.hideModalHandler())}
                selectedItem={item}
             //   saveDetails = {editDetails}
              />
            ),
            showModal: true,
          })
        ); */
      }   
    } 
    

    const template = {
        fields: [

       
{  legend: `${processTittle || "Details"}`,

title: "Current Problem",
type: "richtext",
name: "currentProblem",
contains: "richtext",
//validationProps: "projectDescribtion is required",
inpprops: {
    // md: 3
},
},
{  legend: `${processTittle || "Details"}`,

title: "Solution",
type: "richtext",
name: "solution",
contains: "richtext",
//validationProps: "projectDescribtion is required",
inpprops: {
    // md: 3
},
},


        ],
    };
   

    const templateTwo = {
      fields: [

        {   legend:"Comments Details",
        title: "Type",
        type: 'select',
            name: 'commentType',
            contains: 'Select',
            options: [{ value: "", label: "Select" },
            { value: "Tyepe 1", label: "Tyepe 1" },
            { value: "Tyepe 2", label: "Tyepe 2" },
            { value: "Tyepe 3", label: "Tyepe 4" }],
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
     const initialUnit = await post(api+"/issueSolution/loadIssueSolutionWithComments",{"issueType":"PROCESS","functionActivityId":processId, "random":generateToken});

     
     console.log(processId, "initialUnit",initialUnit)
       if (response.ok && initialUnit.functionActivityId == processId ){

     setDefaultValues(initialUnit)
     setOrderItems(initialUnit?.commentList || []);
     setIssueId(initialUnit?.issueId || "");
   //  setQuality([...quality,...initialQuality]);
   

    }

  }, [get, response, processId]);
  
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

  const newTransac = await post(api+"/issueSolution/create"  , values)
 
 if (response.ok) {
    setIssueId(newTransac?.issueId || "");

    dispatch(modalActions.hideModalHandler())
    AlertHandler("Query Saved Successfully","success")
    
    }else{
    dispatch(modalActions.hideModalHandler())
    AlertHandler("Query Failed To Save","danger")
     
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
      console.log(values);
      values.issueType="PROCESS"
      values.functionActivityId=processId;
      saveFunction(values)
  }
  
  function onSubmitTwo(values) {
    console.log(values);
    values.issueId=issueId
    
    saveOrder(values)
}

    return (
        <div className={classes.bookingMaincontainer} >
        <SimpleCard 
        >
      
     
     </SimpleCard>
     <div className={classes.bookingContainer}>
     <SimpleCard md={12}>
      
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
    </SimpleCard> 

    <SimpleCard md={12}>
      
     <CreateForm
                      template={templateTwo}
                      rowwise={rowWiseFieldsTwo}
                      rowColors={rowColors}
                      validate={validate}
                      onSubmit={onSubmitTwo}
                      onCancel={props.onCancel}
                     
                      buttonName="Save"
                      
                  ></CreateForm>
                  {/*
<details  style={{ backgroundColor: 'white' }}>
  <summary>Instructions: ALL FIELDS ARE IMPORTANT AND NEEDS TO BE FILLED IN ORDER TO PROCESS THE ORDER</summary>
  
</details>

                      */}
    </SimpleCard> 

    <SimpleCard md={12}>
        {<Table
          cols={QueryCommentsTable(showFormHandler, actions)}
          data={orderItems}
          rows={10}
         
         
        />}
      </SimpleCard>
   
    </div>

      </div>
    );
}
export default ProcessMasterQuery;


