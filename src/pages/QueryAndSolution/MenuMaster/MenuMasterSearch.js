import React, { useCallback, useEffect, useState } from 'react';

import {
    CreateForm,
    SearchCard, SimpleCard,
    Table, alertActions,
    api,
    classes,
    modalActions,
    useDispatch,
    useFetch,
    useSelector
} from '../../../Components/CommonImports/CommonImports';


import MenuTable from './Table/MenuTable';
import { generateToken } from '../../../Components/GenerateToken';




const rowWiseFields = 4;

function MenuMasterSearch(props) {

  
  const [data, setData] = useState ([]);
  
const { get, post, cache,response, loading, error } = useFetch({ data: [] });

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
    const initialCusts = await post(api+"/activityMaster/activityMaster",{"random":generateToken()});
   
    if (response.ok){

     setData(initialCusts);
    

    }
  }, [post, get, response]);

  useEffect(() => { loadInitialCustomers() }, [loadInitialCustomers]) // componentDidMount



  const formSaveFunction = async(values)=>{


    const saveUrl = values.processId > 0 ? '/processMaster/create': '/processMaster/create'

    const newDoc = await post(api+saveUrl, values)

    if (response.ok) {
      if(values.processId){
        setData(data.map((doc) => doc.processId === values.processId ? values : doc))
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Process Updated Successfully","success")
      }else{
        setData([...data, newDoc])
        dispatch(modalActions.hideModalHandler())
        AlertHandler("Process Created Succesfully","success")
      }
    }else{
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Process Details Failed To Save","danger")
    }
  }

  const handleDelete = async (values) => {

    console.log("values",values)
  
    const deleteFile = await post(api+ "/documentTypeMaster/delete", values)
    console.log("deleteFile",deleteFile)
    if (response.ok) {
      const deleteRecord = data.filter(item => item.documentTypeId !== values.documentTypeId);
      setData(deleteRecord);
        dispatch(modalActions.hideModalHandler());
        AlertHandler("Document Type Deleted Successfully","success")
      }else{
      dispatch(modalActions.hideModalHandler())
      AlertHandler("Document Type Details Failed To Delete","danger")
    }   

}



  const actions = ["add","delete", "functionForm"];
  const showFormHandler = (item, action) => () => {
    console.log(action);
    /*  if (action === "add") {
        dispatch(
          modalActions.showModalHandler({
            selectedData: { ...item },
            modalWidth: '24%',
            modalLeft: '38%',
            selectedForm: (
              <ProcessForm
                onCancel={()=>dispatch(modalActions.hideModalHandler())}
                selectedItem={{...item}}
                
                saveFunction = {formSaveFunction}
            
              />
            ),
            showModal: true,
          })
        );
      }else if (action === "functionForm") {
        dispatch(
          modalActions.showModalHandler({
            selectedData: { ...item },
            modalWidth: '48%',
            modalLeft: '26%',
            selectedForm: (
              <FunctionForm
                onCancel={()=>dispatch(modalActions.hideModalHandler())}
                selectedItem={{...item}}
                
                // saveFunction = {formSaveFunction}
            
              />
            ),
            showModal: true,
          })
        );
      }else if(action === "delete") {
        handleDelete(item)
    } */
   
   
    };
    

  const template = {
    
    fields: [
        {
            title: "Document Name",
            type: "text",
            name: "documentName",
            contains: "text",
            inpprops: {
             },
          }

    ],
  };

 

  
    
  function validate(watchValues, errorMethods) {
    let { errors, setError, clearErrors } = errorMethods;

   
  }

  function onSubmit(values) {

   
   // searchDetails(values);
  }
  const searchDetails = async (values) => {
    if(values.clicked=="Search"){
      const orderapi = parseFloat(values.palTrStatusId) === 0 ? "/palletTransaction/searchCheckOutTransaction" : "/palletTransaction/searchPalletTransaction";

    const returnObject = await post(api + orderapi, values);
    
        if(returnObject.length>0){
      setData(returnObject);
    }else{
      setData([])
    }
  }

 
  };
  
  
  return (
    <div className={classes.container} >

        <SearchCard
        title="Entry"
     
        buttonName="New Document"
        
        
        onHeaderClick={showFormHandler({}, "add")}
      //  bottonShow={true}
  //      bottonShow={true}
      >
        <CreateForm
          template={template}
          rowwise={rowWiseFields}
        //  watchFields={["palTrStatusId","unitName"]}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
         
          /> </SearchCard>
            
            <SimpleCard md={12}>
<Table cols={MenuTable(showFormHandler, actions)}
          data={data} 
          striped
          rows={25} /> 
      </SimpleCard>
    </div>
  );
}

export default MenuMasterSearch;


