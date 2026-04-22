import React, { useState } from 'react';
import {
    CreateForm,
    Popupcard,
    alertActions,
    classes,
    useDispatch,
    useFetch,
    useSelector,
    api
} from '../../Components/CommonImports/CommonImports';
import { generateToken } from '../../Components/GenerateToken';





const rowWiseFields = 3;

function AddActivity(props) {


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
                title: "Activity",
                type: "select",
                name: "activityId",
                contains: "Select",
                options: activityOption
              },/* {  
                title: "Describtion",
                type: "textarea",
                name: "relDecription",
                contains: "textarea",
                //validationProps: "projectDescribtion is required",
                inpprops: {
                    md: 12
                },
                }, */{
                type: "hidden",
                name: "releaseTrackId",
                contains: "text",
                inpprops: {
                 
                },
              },
          
          
        ],
    };

    const validateValues = async (processId,functionId) => {

        console.log(" process Id",processId)

        if(processId){
            const loadfunctionOption = await post(api + "/functionMaster/loadOptions", { processId:processId,random: generateToken() });
            console.log(" loadfunctionOption",loadfunctionOption)
            if(loadfunctionOption){
                setFunctionOption([{ value: "", label: "Select" },...loadfunctionOption])
            }
        }


        if(functionId){
            const loadActivityOption = await post(api + "/activityMaster/loadOptions", {functionId:functionId, random: generateToken() });
      
            if(loadActivityOption){
                setActivityOption([{ value: "", label: "Select" },...loadActivityOption])
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
          validateValues(watchValues[0],watchValues[1])
        }
      }
    
    function onSubmit(values) {
     
       
        props.saveFunction(values)


    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Add Activity"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={props.selectedItem}
                    watchFields={["processId","functionId"]}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>

            </Popupcard>

        </div>
    );
}

export default AddActivity;


