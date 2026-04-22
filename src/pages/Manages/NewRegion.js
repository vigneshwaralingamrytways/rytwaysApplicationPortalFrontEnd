import React, { useState, useEffect, useCallback, useRef } from 'react';
import SearchCard from '../../UI/cards/SearchCard';
import CreateForm from '../../Components/Forms/CreateForm';
import classes from '../Master/Master.module.css';
import { useSelector, useDispatch } from "react-redux";
import { alertActions } from '../../store/alert-slice';
import { modalActions } from '../../store/modal-Slice';
import api, { downloadLink } from '../../Api';
import useFetch, { Provider } from "use-http";
import Popupcard from '../../UI/cards/Popupcard';
import UploadPaymentTable from './UploadPaymentTable';
import PopupSimpleCard from '../../UI/cards/PopupSimpleCard';
import Table from '../../Components/tables/Table';
import { NewTable } from '../../Components/CommonImports/CommonImports';
// import Popupcard from '../../../UI/cards/Popupcard';


const rowWiseFields = 2;
const rowcolumns = [2, 2, 3, 3, 3];
function NewRegion(props) {


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

  const [stateOptions, setStateOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [state, setState] = useState([]);
  const [country, setCountry] = useState([]);
  const loadStates = useCallback(async () => {
    try {
      const data = await get(api + "/state/getall");
      if (response.ok) {
        setStateOptions(data.map(item => ({ value: item.stateId, label: item.stateName })));
        setState(data)
      }
    } catch (err) {
      console.log("Failed to load states", err);
    }
  }, [get, response]);

  const loadCountries = useCallback(async () => {
    try {
      const data = await get(api + "/country/getall");
      console.log("load country,", data)
      if (response.ok) {
        setCountryOptions(data.map(item => ({ value: item.countryId, label: item.countryName })));

        setCountry(data)
      }
    } catch (err) {
      console.log("Failed to load countries", err);
    }
  }, [get, response]);

  useEffect(() => {
    loadStates();
    loadCountries();
  }, [loadStates, loadCountries]);


    const template = {
        fields: [
          {
            title: "Region",
            type: "text",
            name: "regionName",
            contains: "text",
            inpprops: {
             
            },
          },
         
          
          {
            title: "Group",
            type: "text",
            name: "groupName",
            contains: "text",
            inpprops: {
             
            },
          },
          {
            title: "State",
            type: "select",
            name: "stateId",
            contains: "number",
            inpprops: {
             
            },
            options:stateOptions
          },
          {
            title: "Country Name",
            type: "select",
            name: "countryId",
            contains: "number",
            inpprops: {
             
            },
            options:countryOptions
            // options:
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
      
    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }
    async function onSubmit(values) {
        props.regionSave({...values});
      }
    
    return (
        <div className={classes.container}>
            <Popupcard
                title="New Region" 
                showBack onBack={props.onCancel}


            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                   // rowcolumns={rowcolumns}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    defaultValues={props.selectedItem}
                    buttonName="Save"

                ></CreateForm>
            </Popupcard>

        </div>
    );
}

export default NewRegion;


