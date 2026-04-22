import React, { useCallback, useEffect, useState } from 'react';
import {
    CreateForm,
    PopupSimpleCard,
    Popupcard,
    Table, alertActions,
    api,
    classes,
    modalActions,
    useDispatch,
    useFetch,
    useSelector
} from '../../../../Components/CommonImports/CommonImports';
import { generateToken } from '../../../../Components/GenerateToken';
import ActWizTable from '../Table/ActWizTable';



const rowWiseFields = 3;

function AddActivityWiz(props) {


    const { get, post, response, loading, error } = useFetch({ data: [] });
     
  const [data, setData] = useState ([]);
  const [defaultValue, setDefaultValue] = useState ({});
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


    const loadInitialLists = useCallback(async () => {
        // const { ok } = response // BAD, DO NOT DO THIS
       const loadedLists = await post(api + "/activityMaster/findByFunctionId",{functionId:props.selectedItem.functionId,"random":generateToken()});
       console.log(loadedLists)
       if(loadedLists.length>0){
        setData([...loadedLists]);
       } else{
        setData([])
       }
       
        // console.log({...props.selectedItem})
      }, [get, response]);
    
      useEffect(() => {
        loadInitialLists();
      }, []);
      const handleDelete = async (values) => {

        console.log("values",values)
      
        const deleteFile = await post(api+ "/activityMaster/delete", values)

        if (response.ok) {

          const deleteRecord = data.filter(item => item.activityId !== values.activityId);
          setData(deleteRecord);

         //   dispatch(modalActions.hideModalHandler());
            AlertHandler("Activity Deleted Successfully","success")
          }else{
          dispatch(modalActions.hideModalHandler())
          AlertHandler("Activity Details Failed To Delete","danger")
        }   
    
    }

    const actions = ["edit", "Role","delete"];
    const showFormHandler = (item, action) => () => {
      if(action == "edit"){
            setDefaultValue({...item})
      }else if(action === "delete") {
        handleDelete(item)
    }
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
              title: "Describtion",
              type: "textarea",
              name: "description",
              contains: "textarea",
              //validationProps: "projectDescribtion is required",
              inpprops: {
                  md: 8
              },
              },
            {
                type: "hidden",
                name: "activityId",
                contains: "text",
                inpprops: {
                 
                },
              }
          
        ],
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

    const saveFunction = async(values)=>{


        const saveUrl = values.activityId > 0 ? '/activityMaster/edit': '/activityMaster/create'
    
        const newDoc = await post(api+saveUrl, values)
    
        if (response.ok) {

            setDefaultValue({})

          if(values.activityId){
            setData(data.map((doc) => doc.activityId === values.activityId ? values : doc))
           // dispatch(modalActions.hideModalHandler())
            AlertHandler("Activity Updated Successfully","success")
          }else{
            setData([...data, newDoc])
          //  dispatch(modalActions.hideModalHandler())
            AlertHandler("Activity Created Succesfully","success")
          }
        }else{
          dispatch(modalActions.hideModalHandler())
          AlertHandler("Activity Details Failed To Save","danger")
        }
      }
    

    function onSubmit(values) {
        values.functionId = values.functionId || props.selectedItem.functionId
        values.activityPath = "/process/querySolutions"
        values.userType = "ROLE_WISE"
        
      saveFunction(values)


    }

    return (
        <div className={classes.container}>
            <Popupcard
           //     title="Sub Type"

                title={props.selectedItem.functionName ? ` ${props.selectedItem.functionName}  ` : 'Add Activity'}

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={defaultValue}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>

<PopupSimpleCard>
    
    <Table cols={ActWizTable(showFormHandler, actions)} 
data={data}   striped
       rows={10} /> </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default AddActivityWiz;



