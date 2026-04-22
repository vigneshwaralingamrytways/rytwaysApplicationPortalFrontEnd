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
import BillTable from './BillTable';
import { Label } from 'reactstrap';

const getInitialState = (item) => ({
    ...item,
    invoiceDate: new Date().toISOString().split('T')[0],
    invoiceHeaderId: "",
    invoiceAmount: "",
    utilizedAmount: ""
});
const NewBill = (
    {
        selectedItem, onCancel, loadProjects
    }
) => {
    const { get, post, put, del, response, loading, error } = useFetch({ data: [] });
    const [projectBalance, setProjectBalance] = useState(selectedItem?.balanceAmount || 0);
    // const [defaultValues, setDefaultValues] = useState(selectedItem ? { ...selectedItem, invoiceDate: new Date().toISOString().split('T')[0], invoiceHeaderId: "" } : { invoiceDate: new Date().toISOString().split('T')[0], invoiceHeaderId: "" });
    const [defaultValues, setDefaultValues] = useState(getInitialState(selectedItem));
    const [data, setData] = useState([]);

    const [allInvoices, setAllInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([{ value: "", label: "Select" }]);
    const billFormRef = useRef({});

    useEffect(() => {
        if (selectedItem) {
            setDefaultValues({ ...selectedItem, invoiceDate: new Date().toISOString().split('T')[0], invoiceHeaderId: "" });
        }
    }, [selectedItem]);


    const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
    ]);

    const AlertHandler = (msg, type) => {
        dispatch(alertActions.showAlertHandler({
            showAlert: !showAlert,
            alertMessage: msg,
            alertVariant: type
        }));
    };



    const dispatch = useDispatch();


    const loadInvoices = useCallback(async () => {
        const data = await get(api + "/invoiceHeader/getAll/SALES/?t=" + Date.now());
        console.log("all datas", data)

        if (response.ok) {
            // setAllInvoices(
            //     data.map(item => ({
            //         label: item.invoiceNo,
            //         value: item.invoiceHeaderId
            //     }))
            // );
            setAllInvoices(data)
            if (defaultValues.invoiceDate) {
                const initialFiltered = data
                    .filter(inv => inv.invoiceHeader?.invoiceDate === defaultValues.invoiceDate)
                    .map(inv => ({
                        label: inv.invoiceHeader?.invoiceNo,
                        value: inv.invoiceHeader?.invoiceHeaderId
                    }));
                setFilteredInvoices([{ value: "", label: "Select" }, ...initialFiltered]);
            }
        }
    }, [get, response.ok, defaultValues.invoiceDate]);

    useEffect(() => {
        loadInvoices();
    }, [loadInvoices]);
    useEffect(() => {
        if (allInvoices.length > 0 && defaultValues.invoiceDate) {
            const filtered = allInvoices
                .filter(inv => inv.invoiceHeader?.invoiceDate === defaultValues.invoiceDate)
                .map(inv => ({
                    label: inv.invoiceHeader?.invoiceNo,
                    value: inv.invoiceHeader?.invoiceHeaderId
                }));
            setFilteredInvoices([{ value: "", label: "Select" }, ...filtered]);
        }
    }, [allInvoices, defaultValues.invoiceDate]);


    const syncBillData = (watchedValues, { setValue }) => {
        if (!watchedValues) return;
        const [invoiceDate, invoiceHeaderId] = watchedValues;

        if (invoiceDate) {
            //   filtered ={value:"",label:"Select"}
            const filtered = allInvoices
                .filter(inv => inv.invoiceHeader?.invoiceDate === invoiceDate)
                .map(inv => ({
                    label: inv.invoiceHeader?.invoiceNo,
                    value: inv.invoiceHeader?.invoiceHeaderId
                }));

            // if (filtered !== filteredInvoices) {
            //     setFilteredInvoices(filtered);
            // }

            console.log("filtered data", filtered, invoiceDate)
            const currentId = filteredInvoices.map(f => f.value).join(',');
            const newId = filtered.map(f => f.value).join(',');

            console.log("curent id", currentId)
            console.log("new id", newId)

            if (currentId !== newId) {
                setFilteredInvoices([{ value: "", label: "Select" }, ...filtered]);
                // setDefaultValues(prev=>({ ...prev, invoiceHeaderId: filtered?.[0]?.invoiceHeaderId }))
                //  setFilteredInvoices([{value:"",label:"Select"},...filtered]);
                console.log("fil===>", [{ value: "", label: "Select" }, ...filtered])
            }

        }

        console.log("all invoices", invoiceHeaderId)
        if (invoiceHeaderId) {

            const selectedInv = allInvoices.find(inv => String(inv.invoiceHeader?.invoiceHeaderId) === String(invoiceHeaderId));
            const totalAmount = selectedInv?.paymentDetails?.netTotal || 0
            console.log("selected invoice ", selectedInv)
            console.log("total amount", totalAmount)
            if (selectedInv) {
                // const totalAmount = selectedInv.paymentDetails?.netTotal || 0;
                const totalAmount = selectedInv.paymentDetails?.balanceAmount || 0;
                console.log("Found Amount:", totalAmount);
                setValue("invoiceAmount", totalAmount);
            } else {
                setValue("invoiceAmount", "");
            }
        }
        else {
            setValue("invoiceAmount", "");
            console.log("this is failed in invoice id..", invoiceHeaderId)
        }


    }


    const templateBill = {
        fields: [
            {
                title: "invoice Date",
                type: "date",
                name: "invoiceDate",
                contains: "date",
                inpprops: { md: 4 },
            },
            {
                title: "invoice No",
                type: "select",
                name: "invoiceHeaderId",
                contains: "number",
                options:
                    filteredInvoices,
                inpprops: { md: 4 },
            },
            {
                title: "invoice Amount",
                type: "disabled",
                name: "invoiceAmount",
                // name: "balanceAmount",
                contains: "number",
                inpprops: { md: 4 },
            },
            {
                title: "Utilized Amount",
                type: "number",
                name: "utilizedAmount",
                contains: "number",
                inpprops: { md: 4 },
            },
        ]
    };

    // const validate = (watchValues, errorMethods) => { };

    const loadBills = useCallback(async () => {
        // const allcountries = await get(api + "/Project/getall");

        const allbills = await get(api + `/projectBill/getBill/${selectedItem?.projectId}?t=${Date.now()}`);

        console.log("all bills:", allbills)

        // setProject(allcountries);
        if (response.ok) {
            setData(allbills);

        } else {
            console.log("res++>" + response);
            // AlertHandler("failed to get the Project", "danger")
        }

    }, [get, response])

    useEffect(() => {
        loadBills();
    }, [loadBills]);

    const emptyBillForm = {
        invoiceDate: "",
        invoiceHeaderId: "",
        invoiceAmount: "",
        utilizedAmount: ""
    };
    const saveBill = async (values) => {
        // "/newBill/{projectId}/{invoiceHeaderId}/{utilizedAmount}

        const val = {
            ...values,
            projectId: selectedItem?.projectId,
            invoiceHeaderId: values.invoiceHeaderId
        }
        console.log("new bill values,", val)
        const endpoint = values.billId
            ? `${api}/projectBill/updateBill`
            : `${api}/projectBill/createBill/`;

        // const result = await post(
        //     `${api}/projectBill/createBill/`, val
        // );
        const result = await post(endpoint, val);

        console.log("new  bill.res.", result)
        if (response.ok) {
            setProjectBalance(prev => prev - Number(values.utilizedAmount || 0));

            await loadBills();
            await loadProjects();
            await loadInvoices();
            console.log("reposen: ok:", response)
            // setData(emptyBillForm);
            // setDefaultValues({});
            const freshState = getInitialState(selectedItem);
            setDefaultValues(freshState);
            AlertHandler(values.billId ? "Bill Updated" : "Bill Saved", "success");
        }
        else {
            console.log("reposen: error:", response)
            const freshState = getInitialState(selectedItem);
            setDefaultValues(freshState);
            const errorMsg = result?.message || "Bill not Saved"
            AlertHandler(errorMsg, "danger");
        }
    };




    // const onSubmit = (values) => {
    //     if (values.utilizedAmount > values.invoiceAmount) {
    //         AlertHandler("Utilized Amount cant be greter than Invoice Amount", "danger")

    //     }

    //     setData(prev => [...prev, values]);
    // };

    console.log("Bill:", selectedItem);

    // const invoiceAmt = selectedItem?.invoiceAmount || 0;
    // const projectVal = selectedItem?.projectValue || 0;


    const deleteBillHandler = async (billData) => {
        console.log("val for del", billData.bill)
        const res = await post(api + "/projectBill/deleteBill", billData.bill);
        console.log("res for del", res)
        if (response.ok) {
            setProjectBalance(prev => prev + Number(billData.bill.utilizedAmount || 0));
            AlertHandler("Bill Deleted Successfully", "success");
            await loadBills();
            await loadProjects();
            await loadInvoices();
        } else {
            AlertHandler("Failed to delete bill", "danger");
        }
    };
    const showFormHandler = (item, action) => () => {
        const isEdit = action === "Edit";
        const formData = isEdit ? { ...item } : {};

        if (action === "Delete") {
            deleteBillHandler(item);
        }
        else if (action === "Edit") {
            const editData = {
                // ...selectedItem,
                billId: item.bill?.billId,
                invoiceDate: item.invoiceHeader?.invoiceDate,
                invoiceHeaderId: item.invoiceHeader?.invoiceHeaderId,
                invoiceAmount: item.PaymentDetails?.balanceAmount,
                utilizedAmount: item.bill?.utilizedAmount
            };
            setDefaultValues(editData);
            const filtered = allInvoices
                .filter(inv => inv.invoiceHeader?.invoiceDate === editData.invoiceDate)
                .map(inv => ({
                    label: inv.invoiceHeader?.invoiceNo,
                    value: inv.invoiceHeader?.invoiceHeaderId
                }));
            setFilteredInvoices([{ value: "", label: "Select" }, ...filtered]);
        }



    }
    const actions = ["Edit", "Delete"]
    return (
        <div className={classes.container}>
            <Popupcard
                title={`Bill - ${selectedItem?.projectName || ""} -- (${selectedItem?.projectValue || ""})`}
                showBack onBack={onCancel}
            >

                <CreateForm
                    template={templateBill}
                    validate={syncBillData}
                    onSubmit={saveBill}
                    defaultValues={defaultValues}
                    buttonName={defaultValues.billId ? "Update" : "Save"}

                    watchFields={["invoiceDate", "invoiceHeaderId"]}
                />

                <>
                    <p>balance Amount for this Project - {projectBalance}</p>
                </>
                <PopupSimpleCard>
                    <NewTable
                        cols={BillTable({ showFormHandler, actions })}

                        data={data}
                        striped
                        rows={10}
                        showFilterIcon={false}

                    />
                </PopupSimpleCard>
            </Popupcard>
        </div>
    );
};
export default NewBill;