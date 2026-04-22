import React, { useState, useEffect, useCallback } from 'react';



import {

  Popupcard,SearchCard,SimpleCard,CreateForm,Table,alertActions,modalActions,useSelector,useDispatch,api,downloadLink,useFetch,Provider,classes,Row, Button, NavCreateForm, PopupSimpleCard
  } from '../../Components/CommonImports/CommonImports'

import MaterialItemTable from './Table/MaterialItemTable';



const rowWiseFields = 2;


function MaterialItemForm(props) {


 const {orderItems, defvalues} = props;
 const[materials,setMaterials]=useState([])
 const[mat,setMat]=useState({})
    const { get, post, response, loading, error } = useFetch({ data: [] });
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


    const saveDetails = async (entry) => {
      //  procMaps
      const materialEntryapi = entry.gateEntryid ? "/materialGE/create" : "/materialGE/create";
      const returnObject = await post(api + materialEntryapi, entry);
      if (returnObject) {
        if (entry.materialEntryId) {
          setMaterials(
            materials.map((material) =>
             material.materialEntryId === returnObject.materialEntryId
                ? returnObject
                : material
            )
          );
        //  dispatch(modalActions.hideModalHandler());
         // AlertHandler("Gate Entry Saved Successfully", "success");
        } else if (returnObject.materialEntryId > 0) {
          setMaterials([returnObject, ...materials]);
      //    dispatch(modalActions.hideModalHandler());
      //    AlertHandler("Gate Entry Saved Successfully", "success");
        }
      } else {
     //   dispatch(modalActions.hideModalHandler());
        AlertHandler("Failed to Save the Details", "danger");
      }
    };

    const deleteDetails = async (entry) => {
      //  procMaps
      const materialEntryapi = "/materialGE/delete" 
      const returnObject = await post(api + materialEntryapi, entry);
      if (returnObject) {
       // array.filter(obj => obj.id !== id);
        setMaterials(
          materials.filter((material) =>
           material.materialEntryId !== entry.materialEntryId
            
          )
        );
      } else {
     //   dispatch(modalActions.hideModalHandler());
        AlertHandler("Failed to Save the Details", "danger");
      }
    };



    const loadInitialData = useCallback(async () => {
      // const { ok } = response // BAD, DO NOT DO THIS
      const initialdata = await post(api + "/materialGE/listAll" ,{"longId":props.entryId,
      "loadTime":Date().toLocaleString(),"catName":props.entryType});
      console.log(initialdata)
      if (response.ok){
        setMaterials(initialdata);        
     }
      
          //  console.log(initialCusts)
    }, [get, response]);
  
    useEffect(() => {
         loadInitialData();
      
    }, []);

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


    const actions = ["Status"];
  const showFormHandler = (item, action) => () => {
   if(action==="Edit"){
    setMat(item)
   }else if(action==="delete"){
    deleteDetails(item)
   }
   
      
  };
  

  const template = {
    fields: [
    
      {
        title: "Item name",
        type: "text",
        name: "materialName",
        contains: "text",
        inpprops:{
            md:8

        }
      },
      {
        title: "Quantity",
        type: "text",
        name: "qty",
        contains: "text",
      //  validationProps: "projectDescribtion is required",
        inpprops: {
            md:4
          
        },
    }, {
      title: "Uom",
      type: "text",
      name: "uom",
      contains: "text",
    //  validationProps: "projectDescribtion is required",
      inpprops: {
          md:4
        
      },
  },{
     type: "hidden",
      name: "entryType",
      value: props.entryType,
    //  validationProps: "projectDescribtion is required",
      inpprops: {
          md:4
        
      },
  },{
    type: "hidden",
     name: "entryId",
     value: props.entryId,
   //  validationProps: "projectDescribtion is required",
     inpprops: {
         md:4
       
     },
 },
    ],
  };
    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

 
      function onSubmit(values) {
        // Include RegionName and unitName in the status data

       saveDetails(values)
    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="Material Item"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={mat}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>
     <PopupSimpleCard >
   
   <Table cols={MaterialItemTable(showFormHandler, actions)}
             data={materials} 
             striped
            
              /> 
         </PopupSimpleCard>
            </Popupcard>

        </div>
    );
}

export default MaterialItemForm;


