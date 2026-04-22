import React, { useState } from 'react';
import {
    CreateForm,
    Popupcard,
    alertActions,
    classes,
    useDispatch,
    useFetch,
    useSelector,
    api,
    modalActions
} from '../../Components/CommonImports/CommonImports';
import { generateToken } from '../../Components/GenerateToken';





const rowWiseFields = 3;

function AddNewActivity(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
    const [processOption, setProcessOption] = useState(props.processOption);
  const [functionOption, setFunctionOption] = useState([{ value: "", label: "Select" }]);
  const [activityOption, setActivityOption] = useState([{ value: "", label: "Select" }]);
  const [prevWatchValues, setPrevWatchValues] = useState([]);
     
  const [data, setData] = useState ([ ]);
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
                title: "Process",
                type: "select",
                name: "processId",
                contains: "Select",
                options: processOption
              },{
                title: "Function",
                type: "select",
                name: "functionId",
                contains: "Select",
                options: functionOption
              },{
                title: "Activity Name",
                type: "text",
                name: "activityName",
                contains: "text",
                inpprops: {
                    // md:4,
                },
            },{  
              title: "Describtion",
              type: "textarea",
              name: "description",
              contains: "textarea",
              //validationProps: "projectDescribtion is required",
              inpprops: {
                  md: 12
              },
              },
            {
                type: "hidden",
                name: "activityId",
                contains: "text",
                inpprops: {
                 
                },
              },{
                type: "hidden",
                name: "releaseTrackId",
                contains: "text",
                inpprops: {
                 
                },
              },
          
          
        ],
    };

    const validateValues = async (processId) => {

        console.log(" process Id",processId)

        if(processId){
            const loadfunctionOption = await post(api + "/functionMaster/loadOptions", { processId:processId,random: generateToken() });
            console.log(" loadfunctionOption",loadfunctionOption)
            if(loadfunctionOption){
                setFunctionOption([{ value: "", label: "Select" },...loadfunctionOption])
            }
        }


        
    }

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
          validateValues(watchValues[0])
        }
      }
    

      const saveFunction = async(values)=>{


        const saveUrl = values.activityId > 0 ? '/activityMaster/edit': '/activityMaster/create'
    
        const newDoc = await post(api+saveUrl, values)
    
        if (response.ok) {

            

          if(values.activityId){
            
           // dispatch(modalActions.hideModalHandler())
            AlertHandler("Activity Updated Successfully","success")
          }else{
           
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Activity Created Succesfully","success")
          }
        }else{
          dispatch(modalActions.hideModalHandler())
          AlertHandler("Activity Details Failed To Save","danger")
        }
      }
    function onSubmit(values) {
     
       
        values.activityPath = "/process/querySolutions"
        values.userType = "ROLE_WISE"
        
      saveFunction(values)


    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Create Activity"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={props.selectedItem}
                    watchFields={["processId"]}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>

            </Popupcard>

        </div>
    );
}

export default AddNewActivity;


