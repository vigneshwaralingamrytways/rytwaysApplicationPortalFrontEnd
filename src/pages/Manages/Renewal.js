import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from "react-redux";


import CreateForm from '../../Components/Forms/CreateForm';
import classes from '../Master/Master.module.css';


// import useFetch, { Provider } from "use-http";
import Popupcard from '../../UI/cards/Popupcard';

import {

    SimpleCard,
    Table,
    api,
    useFetch,
    alertActions,
    modalActions,
    //  useDispatch,
    useSelector,
    //  classes,

} from "../../Components/CommonImports/CommonImports";

const Renewal = (
    { showFormHandler, actions, selectedItem ,onCancel}
) => {
    const { get, post, put, del, response, loading, error } = useFetch({ data: [] });

    const [defaultValues, setDefaultValues] = useState({});



    const [data, setData] = useState([]);

    const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
    ]);

    const AlertHandler = (alertContent, alertType) => {
        dispatch(
            alertActions.showAlertHandler({
                showAlert: !showAlert,
                alertMessage: alertContent,
                alertVariant: alertType,
            })
        );
    };
    useEffect(() => {
        if (selectedItem) {
            setDefaultValues(selectedItem);
        }
    }, [selectedItem]);

    const dispatch = useDispatch();

    const templateBill = {
        fields: [
            {
                title: "Renewal Date",
                type: "date",
                name: "renewalDate",
                contains: "date",
                inpprops: { md: 4 },
            },
            {
                title: "AMC Start Date",
                type: "date",
                name: "projectStartDate",
                contains: "date",
                inpprops: { md: 4 },
            },
            {
                title: "AMC End Date",
                type: "date",
                name: "projectEndDate",
                contains: "date",
                inpprops: { md: 4 },
            },
            // {
            //     title: "invoice No",
            //     type: "select",
            //     name: "dinvoiceNo",
            //     contains: "number",
            //     options:[],
            //     inpprops: { md: 4 },
            // },
            // {
            //     title: "invoice Amount",
            //     type: "number",
            //     name: "invoiceAmount",
            //     contains: "number",
            //     inpprops: { md: 4 },
            // },
            {
                title: "Project Value",
                type: "number",
                name: "projectValue",
                contains: "number",
                inpprops: { md: 4 },
            },
        ]
    };

    const validate = (watchValues, errorMethods) => { };

    const onSubmit = async (val) => {
        // setData(prev => [...prev, values]);
        //"/renewalProject/{projectId}/{amcStartDate}/{renewalDate}/{amcEndDate}/{projectValueNew}
        const item = Array.isArray(selectedItem) ? selectedItem[0] : selectedItem;
        const projectId = item?.projectId;

        // console.log("date amc", amcStartDate)
    const value={...val}

    delete value.projectId

        console.log("val", val)
        console.log("projectid", projectId)
        console.log("selected items", selectedItem)
        const res = await post(api + `/manageProject/create/`,value)
        console.log("res for save", res)
        if (response.ok) {
            AlertHandler("renewal project created succusfully", "success");
            // AlertHandler("renewal updated","")
           if (onCancel) {
            onCancel(); 
        }
        }
        else {
            AlertHandler("renewal creation failed", "danger");
        }
    };




    return (
        <div className={classes.container}>
            <Popupcard title="Renewal"  showBack onBack={onCancel}>
                <CreateForm
                    template={templateBill}
                    validate={validate}
                    onSubmit={onSubmit}
                    defaultValues={defaultValues}
                    buttonName="Save"
                />
                {/* <PopupSimpleCard>
                    <NewTable
                       cols={RenewalTable({ showFormHandler, actions })}

                        data={data}
                        striped
                        rows={10}
                        showFilterIcon={false}
                    />
                </PopupSimpleCard> */}
            </Popupcard>;
        </div>
    );
};
export default Renewal