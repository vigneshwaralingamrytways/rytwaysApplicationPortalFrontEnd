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
} from '../../Components/CommonImports/CommonImports';
import FunctionTable from './Table/FunctionTable';
import { generateToken } from '../../Components/GenerateToken';
import ActivityTable from './Table/ActivityTable';
import RoleForm from './RoleForm';



const rowWiseFields = 3;

function ActivityForm(props) {


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
      
        const deleteFile = await post(api+ "/folderMaster/delete", values)

        if (response.ok) {

          const deleteRecord = data.filter(item => item.folderId !== values.folderId);
          setData(deleteRecord);

         //   dispatch(modalActions.hideModalHandler());
            AlertHandler("Folder Deleted Successfully","success")
          }else{
          dispatch(modalActions.hideModalHandler())
          AlertHandler("Folder Details Failed To Delete","danger")
        }   
    
    }

    const actions = ["edit", "Role","delete"];
    const showFormHandler = (item, action) => () => {
      if(action == "edit"){
            setDefaultValue({...item})
      }else if(action === "delete") {
        handleDelete(item)
    }else if (action === "Role") {
        dispatch(
          modalActions.showModalHandler({
            selectedData: { ...item },
            // modalWidth: '24%',
            // modalLeft: '38%',
            selectedForm: (
              <RoleForm
                onCancel={()=>dispatch(modalActions.hideModalHandler())}
                selectedItem={{...item}}
                
               // saveFunction = {saveFunction}
            
              />
            ),
            showModal: true,
          })
        );
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


        const saveUrl = values.activityId > 0 ? '/activityMaster/create': '/activityMaster/create'
    
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
    
    <Table cols={ActivityTable(showFormHandler, actions)} 
data={data}   striped
       rows={10} /> </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default ActivityForm;


