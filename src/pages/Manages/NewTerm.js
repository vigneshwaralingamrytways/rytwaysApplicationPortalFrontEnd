import React, { useState, useEffect, useCallback, useRef } from 'react';
 
import CreateForm from '../../Components/Forms/CreateForm';
import classes from '../Master/Master.module.css';
import { useSelector, useDispatch } from "react-redux";
import { alertActions } from '../../store/alert-slice';
 
import api, { downloadLink } from '../../Api';
import useFetch, { Provider } from "use-http";
import Popupcard from '../../UI/cards/Popupcard';
 
// import Popupcard from '../../../UI/cards/Popupcard';


const rowWiseFields = 2;
const rowcolumns = [2, 2, 3, 3, 3];
function NewTerms(props) {



  const { regionId } = props;

    const { get, post, response, loading, error } = useFetch({ data: [] });
    const [defaultValues,setDefaultValues] = useState({});
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

    const LoadInitialTerms = useCallback(async () => {
      // const { ok } = response // BAD, DO NOT DO THIS
      const initialTerms = await post(api+`/regionMaster/getTerms`,{"regionId":regionId,random:Math.random()});
     console.log("Load",initialTerms)
      if (response.ok) setDefaultValues(initialTerms);
      console.log("Load2",initialTerms)
    }, [get, regionId, response]);
  
    useEffect(() => { LoadInitialTerms() }, [LoadInitialTerms, regionId])


    const template = {
        fields: [
          {
            title: "Inco Terms",
            type: "text",
            name: "incoTerms",
            contains: "text",
            inpprops: {
             
            },
          },
          {
            title: "Freight",
            type: "text",
            name: "freight",
            contains: "text",
            inpprops: {
             
            },
          },
          {
            title: "Packing",
            type: "text",
            name: "packing",
            contains: "text",
            inpprops: {
             
            },
          },
          {
            title: "Reels",
            type: "text",
            name: "reels",
            contains: "text",
            inpprops: {
             
            },
          },
          {
            title: "Commission",
            type: "text",
            name: "commission",
            contains: "text",
            inpprops: {
             
            },
          },
          {
            type: "hidden",
            name: "id",
            contains: "text",
            inpprops: {
              minlength: 0,
              maxlength: 999999,
            },
          },
          
        ],
      };
      
      const  TermsSave = async (Terms)=>{
        const newTerms = await post(api+'/termsandconditions/create', Terms)
        console.log("received",Terms)
        console.log("api",newTerms)
        if (response.ok) {
          
          //props.updateTerms(props.regionId, newTerms);
          //  dispatch(modalActions.hideModalHandler())
            AlertHandler("Terms Updated Successfully","success");
            setDefaultValues(newTerms);
         
        }else{
         // dispatch(modalActions.hideModalHandler())
          AlertHandler("Terms Details Failed To Save","danger")
        }
        
      }

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }
    async function onSubmit(values) {

      
      TermsSave(values);
      LoadInitialTerms();
      }
    
    return (
        <div className={classes.container}>
            <Popupcard
                title="New Terms"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                   // rowcolumns={rowcolumns}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    defaultValues={defaultValues}
                    buttonName="Save"

                ></CreateForm>
            </Popupcard>

        </div>
    );
}

export default NewTerms;


