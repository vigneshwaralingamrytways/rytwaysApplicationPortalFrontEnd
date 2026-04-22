import React, { useState, useEffect, useCallback } from 'react';
import SearchCard from '../../../../UI/cards/SearchCard';
import CreateForm from '../../../../Components/Forms/CreateForm';
import { useSelector, useDispatch } from "react-redux";
import { alertActions } from '../../../../store/alert-slice';
import { modalActions } from '../../../../store/modal-Slice';
import api, { downloadLink } from '../../../../Api';
import useFetch, { Provider } from "use-http";
import Popupcard from '../../../../UI/cards/Popupcard';
import PopupSimpleCard from '../../../../UI/cards/PopupSimpleCard';
import Table from '../../../../Components/tables/Table';
import classes from '../../Main.module.css';
import CcdTable from '../Table/CcdTable';


const rowWiseFields = 1;


function QueryStatus(props) {


 const {orderItems, defvalues} = props;
    const [data, setData] = useState([]);
    const [defaultValues,setDefaultValues] = useState(defvalues);
    const [saveOrderItems, setSaveOrderItems] = useState(orderItems);
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


    const actions = ["Status"];
  const showFormHandler = (item, action) => () => {
    console.log(action);
   
      
  };
  

    const template = {
        fields: [
            {
                title: "CC Date",
                type: "date",
                name: "ccDate",
                contains: "date",
                inpprops: {
                    format: "dd/mm/yy",
                },
            },
            {
                title: "Comments",
                type: "textarea",
                name: "comments",
                contains: "textarea",
              //  validationProps: "projectDescribtion is required",
                inpprops: {
                    md: 12
                },
            },
        ],
    };

    function validate(watchValues, errorMethods) {
        let { errors, setError, clearErrors } = errorMethods;




    }

   /*

    const  statusSave = async (Approval)=>{
        console.log(Approval,"RegionNamereceived");
        const newApproval = await post(api+'/approval/create', Approval)
        if (response.ok) {
          if(Approval.approvalId){
            setData(data.map((app) => app.approvalId === Approval.approvalId ? Approval : app))
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Approval Updated Successfully","success")
          }else{
            setData([...data, newApproval])
            dispatch(modalActions.hideModalHandler())
            AlertHandler("Approval Created Succesfully","success")
          }
        }else{
          dispatch(modalActions.hideModalHandler())
          AlertHandler("Discount Details Failed To Save","danger")
        }
      }
*/
      function onSubmit(values) {
        // Include RegionName and unitName in the status data

        props.orderSave({
            id: values.id,
            comments: values.comments,
            ccDate: values.ccDate,
              },"comments");
    }

    return (
        <div className={classes.container}>
            <Popupcard
                title="CC Date"

            >
                <CreateForm
                    template={template}
                    rowwise={rowWiseFields}
                    defaultValues={defvalues}
                    validate={validate}
                    onSubmit={onSubmit}
                    onCancel={props.onCancel}
                    buttonName="Save"

                ></CreateForm>
        {/*           <PopupSimpleCard md={12}>
    
    <Table cols={CcdTable(showFormHandler,actions)} 
data={data}   striped
       />
    </PopupSimpleCard> */}
            </Popupcard>

        </div>
    );
}

export default QueryStatus;


