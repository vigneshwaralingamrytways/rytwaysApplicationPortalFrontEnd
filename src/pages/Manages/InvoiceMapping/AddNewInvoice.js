import React, { useCallback, useEffect, useState } from "react";
import classes from "./Wizard.module.css";
import * as FaIcons from "react-icons/fa";
import useFetch from "use-http";
import { useSelector, useDispatch } from "react-redux";
import { alertActions } from "../../../store/alert-slice";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { api, Button, CreateForm, NewTable, useHistory } from "../../../Components/CommonImports/CommonImports";
import InvoiceDetailsTable from "./InvoiceDetailsTable";


const AddNewInvoice = (props) => {
    const location = useLocation();
    const { selectedItem, invoiceDetails, reset, customerId } = location.state || props || {};
    const custId = props.customerId?.customerId || props.item?.customerId || selectedItem?.customerId;
    console.table(props?.item)
    // const { MoveToPage, selectedItem, invoiceDetails, reset } = location.state || props || {};
    const { get, post, response } = useFetch({ data: [] });

    const [defaultValues, setDefaultValues] = useState(reset ? reset : {});
    const [orderItems1, setOrderItems1] = useState([]);
    const [orderItems2, setOrderItems2] = useState(invoiceDetails?.map((item, index) => ({
        ...item,
        uniqueId: index + 1,
        specStatus: "Completed"
    })) || []);

    const dispatch = useDispatch();
    const history = useHistory();

    const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
    ]);

    const AlertHandler = (alertContent, alertType) => {
        dispatch(alertActions.showAlertHandler({
            showAlert: !showAlert,
            alertMessage: alertContent,
            alertVariant: alertType,
        }));
    };

    const loadInitialData = useCallback(async () => {
        if (selectedItem?.dealerDirectCustomer) {
            const params = new URLSearchParams({
                dealerDirectCustomer: selectedItem.dealerDirectCustomer,
                customer: selectedItem.customer || selectedItem.dealerDirectCustomer,
                productCategoryId: selectedItem.productCategoryId || 1,
                rand: Math.random()
            }).toString();

            const obj = await post(api + "/orderInvoice/getCoHdrsByCustomer?" + params);
            if (obj && obj.length > 0) {
                const mappedData = obj.map((item, index) => ({
                    ...item,
                    uniqueId: index + 1,
                    specStatus: "Pending",
                    quantity1: item?.quantity
                }));
                setOrderItems1(mappedData);
            }
        }
    }, [selectedItem, post]);

    useEffect(() => { loadInitialData() }, [loadInitialData]);

    const showFormHandler = (item, action) => () => {
        const headerId = item.invoiceHeader?.invoiceHeaderId;

        if (action === "Add") {
            setSaless(prev => prev.map(p => {
                if (p.invoiceHeader?.invoiceHeaderId === headerId) {
                    const newStatus = !p.isSelected;
                    return { ...p, isSelected: newStatus, isSaved: newStatus };
                }
                return p;
            }));
        }
        else if (action === "Delete") {
            setSaless(prev =>
                prev.map(p =>
                    p.invoiceHeader?.invoiceHeaderId === headerId
                        ? { ...p, isSelected: false, isSaved: false }
                        : p
                )
            );
        }
    };
    const handleFinalSave = async () => {
        const selectedIds = Saless.filter(item => item.isSelected)
            .map(item => {
                return item.invoiceHeader?.invoiceHeaderId || item.invoiceHeaderId || item.id;
            });
        const txnId = selectedItem?.transactionId || selectedItem?.transaction_id;
        console.log("selectedids:", selectedIds)
        console.log("transaction id", txnId)
        if (selectedIds.length === 0) {
            AlertHandler("Please select at least one invoice", "danger");
            return;
        }
        const endpoint = `${api}/bankTransactionDetails/mappingInvoices/${selectedIds.join(",")}/${txnId}`;

        const res = await post(endpoint);
        console.log("res:", res)

        if (response.ok) {
            AlertHandler("Invoice Mapping Saved Successfully", "success");
            await props.loadTransaction();
            props.onCancel()
        } else {
            await props.loadTransaction();
            AlertHandler(res || "Failed to map invoices", "danger");
        }
    };
    const handleSaveInvoice = async (status) => {
        const invoiceHdr = {
            ...defaultValues,
            ...selectedItem,
            statusId: status === "Draft" ? 10 : 20,
            invoiceType: "Order Invoice",
            invoiceDetails: orderItems2
        };

        const orderApi = "/orderInvoice/create";
        await post(api + orderApi, invoiceHdr);
        if (response.ok) {
            AlertHandler("Invoice Saved Successfully", "success");
            if (props.onCancel) props.onCancel();
        } else {
            AlertHandler("Failed to Save Invoice", "danger");
        }
    };

    const steps = [
        { title: `Invoice Item`, icon: <FaIcons.FaPlus color="#474746" /> },
        { title: `Selected Invoice Item`, icon: <FaIcons.FaListAlt color="#474746" /> }
    ];

    const [step, setStep] = useState(1);
    const totalSteps = steps.length;
    const completedPercent = ((step - 1) / (totalSteps - 1)) * 100;

    const [selectedSales, setSelectedSales] = useState([]);
    const [Saless, setSaless] = useState([]);
    const [allSales, setAllSales] = useState([]);
    const loadSaless = useCallback(async () => {
        // const custId = props?.item?.customerId;
        const data = await get(api + "/invoiceHeader/getAllInvoiceByCustomerId/" + custId);
        // const data = await get(`${api}/invoiceHeader/getAll/SALES?t=${Date.now()}`);
        console.table(data)
        if (response.ok) {
            // setSaless(data);
            // setAllSales(data);
            const mapped = data.map(item => ({
                ...item,
                isSelected: false,
                isSaved: false
            }));
            setSaless(mapped);
        }
    }, [get, response, custId]);

    useEffect(() => {
        loadSaless();
    }, [loadSaless]);

    const [paymentModeList, setPaymentModeList] = useState([]);

    const loadPaymentModes = useCallback(async () => {
        const res = await get(api + "/paymentMode/getall?t=" + Date.now());
        console.log("paymentmode..", res)
        if (response.ok) {
            setPaymentModeList(

                res.map(pm => ({
                    value: pm.paymentModeId,
                    label: pm.paymentModeName
                }))
            );
        } else {
            setPaymentModeList([]);
        }
    }, [get, response]);
    useEffect(() => {
        loadPaymentModes();
    }, [loadPaymentModes]);

    const template = {
        fields: [


            {
                title: "Payment Mode",

                name: "paymentModeId",
                type: "select",
                inpprops: { md: 12, rows: 4 },
                options: paymentModeList,
                validationProps: "Payment mode is required"
            },
            {
                options: [],
                title: "Amount",
                name: "amount",
                type: "number",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Item description is required"
            },
            {
                options: [],
                title: "TDS",
                name: "tds",
                type: "number",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Item description is required"
            },

            {
                options: [],
                title: "remark",//remarker
                name: "remark",
                type: "number",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Item description is required"
            },
        ]
    }
    const renderContent = () => {
        switch (step) {
            case 1:
                return <NewTable data={Saless} cols={InvoiceDetailsTable(showFormHandler, true, false, "delete", false, false)} rows={15} />;
            case 2:
                const selectedList = Saless.filter(item => item.isSelected === true);
                return (
                    <>
                        {/* <CreateForm
                            template={template}
                            rowwise={3}
                            defaultValues={selectedItem}
                            // onSubmit={SavesalarySlip}
                            // onCancel={onCancel}
                            buttonName="Save"
                        // validate={validate}
                        /> */}
                        <NewTable data={selectedList} cols={InvoiceDetailsTable(showFormHandler, false, true, "Delete", true, false)} rows={15} />
                        <div style={{ display: 'flex', justifyContent: "flex-end", marginTop: "20px" }}>
                            <Button style={{ margin: "15px" }} onClick={handleFinalSave}>Save</Button>
                            <Button variant="danger" style={{ margin: "15px" }}>Cancel</Button>
                        </div>
                    </>
                );
            default: return null;
        }
    };

    return (
        <div className={classes.wizardContainer}>
            <div className={classes.stepper} style={{ "--stepper-width": "100%" }}>
                <div className={classes.stepLineTrack}></div>
                <div className={classes.stepLineOverlay} style={{ width: `${completedPercent}%` }}></div>
                {steps.map((s, index) => {
                    const current = index + 1;
                    const isActive = step === current;
                    return (
                        <div className={classes.stepItem} key={current} onClick={() => setStep(current)} style={{ cursor: "pointer" }}>
                            <div className={`${classes.stepIcon} ${isActive ? classes.activeIcon : ""}`}>{s.icon}</div>
                            <div className={`${classes.stepLabel} ${isActive ? classes.activeLabel : ""}`}>{s.title}</div>
                        </div>
                    );
                })}
            </div>

            <div className={classes.wizardCard} style={{ maxWidth: "100%" }}>
                <div className={classes.greenHeader} style={{ maxWidth: "100%" }}>
                    {steps[step - 1].title}
                </div>
                <div className={classes.stepContent} style={{ maxWidth: "100%", backgroundColor: "white", padding: "20px" }}>
                    {renderContent()}
                </div>
            </div>

            <div className={classes.stepButtons}>
                <button onClick={() => setStep(step - 1)} disabled={step === 1}>Back</button>
                <button onClick={() => setStep(step + 1)} disabled={step === totalSteps}>Next</button>
            </div>
        </div>
    );
};

export default AddNewInvoice;