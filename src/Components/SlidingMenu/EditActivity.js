import React, { useCallback, useEffect, useState } from 'react';
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




const rowWiseFields = 1;

function EditActivity(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
    const activityId = useSelector((state) => state.sideBar.activityId);

     const [defaultValues, setDefaultValues] = useState({})
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


    const loadInitialCustomers = useCallback(async () => {
        // const { ok } = response // BAD, DO NOT DO THIS
        const initialCusts = await post(api+"/activityMaster/findActivityById",{activityId:activityId});
        if (response.ok) setDefaultValues(initialCusts);
        console.log(initialCusts)
      }, [get, post, response]);
    
      useEffect(() => { loadInitialCustomers() }, [loadInitialCustomers]) // componentDidMount


    const actions = ["Add","AddBooking","status","payment","document"];
    const showFormHandler = (item, action) => () => {
      console.log(action);
      
    };

    const template = {
        fields: [

            {
                title: "Activity Name",
                type: "text",
                name: "activityName",
                contains: "text",
                inpprops: {
                    // md:4,
                },
            },{  
                title: "Description",
                type: "textarea",
                name: "description",
                contains: "textarea",
                //validationProps: "projectDescribtion is required",
                inpprops: {
                    md: 12
                },
                },{
                type: "hidden",
                name: "activityId",
                contains: "text",
                inpprops: {
                 
                },
              },
          
          
        ],
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

    function onSubmit(values) {
     
       
        props.saveFunction(values)


    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Activity"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={defaultValues}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>

            </Popupcard>

        </div>
    );
}

export default EditActivity;


