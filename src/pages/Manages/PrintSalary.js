import React, { useCallback, useEffect, useState } from "react";
// import NewPayment from "./NewPayment";
import {
    CreateForm,
    SimpleCard,
    Table,
    api,
    useFetch,
    alertActions,
    modalActions,
    useDispatch,
    useSelector,
    classes,
    Popupcard,
} from "../../Components/CommonImports/CommonImports";


import { saveAs } from 'file-saver';
export default function PrintSalary({
    selectedItem,
    onCancel,
    saveEmployee,
    validate,
    actions,
}) {


    const { get, del, post, response, loading, error } = useFetch({ data: [] });
    const dispatch = useDispatch();

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



    const template = {
        fields: [



            {
                inpprops: {},
                title: "Month",
                type: "date",
                contains: "date",
                options: [],
                name: "date",
                validationProps: "Month  is required",
            },]
    }



    const SavesalarySlip = async (val) => {


        try {

            const formattedDate = new Date(val.date).toISOString().split('T')[0];
            console.log("Sending Date to Backend:", formattedDate);

            const data = await get(api + `/manageEmployee/printPayslip/${val.employeeId}/${val.date}`);
            if (response.ok) {
                const blob = await response.blob();
                const fileName = `Payslip_${val.employeeName || 'Employee'}_${val.date}.pdf`;
                saveAs(blob, fileName);
                AlertHandler("Payslip downloaded successfully", "success");
                dispatch(modalActions.hideModalHandler());
            }
            else {
                AlertHandler("Failed to generate Payslip", "danger");
                console.log("Download failed:", response);
            }
        }
        catch (e) {
            console.log("Print Error:", e);
        }
        return;

    }
    return (
        <div className={classes.container}>
            <Popupcard
                title="Print Salary"
                 showBack onBack={onCancel}


            >
                <CreateForm
                    template={template}
                    rowwise={3}
                    defaultValues={selectedItem}
                    onSubmit={SavesalarySlip}
                    onCancel={onCancel}
                    buttonName="Generate"
                    validate={validate}
                />


            </Popupcard>
        </div>
    );
}
