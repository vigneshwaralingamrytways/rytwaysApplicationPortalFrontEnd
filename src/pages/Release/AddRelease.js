import React, { useState } from 'react';
import {
    CreateForm,
    Popupcard,
    alertActions,
    classes,
    useDispatch,
    useFetch,
    useSelector
} from '../../Components/CommonImports/CommonImports';




const rowWiseFields = 1;

function AddRelease(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
     
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
                title: "Release Name",
                type: "text",
                name: "releaseName",
                contains: "text",
                inpprops: {
                    // md:4,
                },
            },{  
                title: "Describtion",
                type: "textarea",
                name: "relDecription",
                contains: "textarea",
                //validationProps: "projectDescribtion is required",
                inpprops: {
                    md: 12
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

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

    function onSubmit(values) {
     
       
        props.saveFunction(values)


    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Release"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={props.selectedItem}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>

            </Popupcard>

        </div>
    );
}

export default AddRelease;


