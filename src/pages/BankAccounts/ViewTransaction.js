import React, { useCallback, useEffect, useState } from "react";
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
import ViewTransactionTable from "./ViewTransactionTable";

import NewTable from "../../Components/NewTable/NewTable";
import ReconcileMapping from "../Manages/ReconcileMapping";
import AddNewInvoice from "../Manages/InvoiceMapping/AddNewInvoice";
import NewTransaction from "./NewTransaction";

const ViewTransaction = (props) => {


    const {
        isReconcile = false,
        singleSelect = false,
        isMapped,
        onRowSelect,
        transactionTypeFilter,
        selectedId, refreshKey
    } = props;
    const { get, del, post, response, loading, error } = useFetch({ data: [] });
    const dispatch = useDispatch();
    const [Customers, setCustomers] = useState([]);
    const [transaction, setTransaction] = useState([]);
    const [allTransactions, setAllTransactions] = useState([]);

    const [bankTransaction, setBankTransaction] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [selectedTransactionId, setSelectedTransactionId] = useState(null);
    const [showSlider, setShowSlider] = useState(false);
    const [sliderContent, setSliderContent] = useState(null);
    const [defaultValues, setDefaultValues] = useState({});

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

    /* ---------------- Load Customers ---------------- */
    const loadCustomers = useCallback(async () => {
        const data = await get(api + "/customer/getall");

        if (response.ok) {

            setCustomers([
                { value: "", label: "Select" },
                ...(Array.isArray(data) ? data.map((s) => ({
                    value: s.customerId,
                    label: s.customerName,
                })) : []),
            ]);
        }
    }, [get, response]);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

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

    const [allBankAccounts, setAllBankAccounts] = useState([]);
    const loadBankAccounts = useCallback(async () => {
        const data = await get(`${api}/companyBankAccounts/getAll?t=${Date.now()}`);
        console.table(data)
        if (response.ok) {

            setAllBankAccounts([
                { value: "", label: "Select" },
                ...(Array.isArray(data) ? data.map(pm => ({
                    value: pm.companyBankAccountId,
                    label: pm.accountNo
                })) : [])
            ]);
        }
    }, [get, response]);

    useEffect(() => {
        loadBankAccounts();
    }, [loadBankAccounts]);

    const filterTemplate = {
        fields: [
            {
                title: "From Date",
                name: "fromDate",
                type: "date",
                inpprops: { md: 3 },
            },
            {
                title: "To Date",
                name: "toDate",
                type: "date",
                inpprops: { md: 3 },
            },
            {
                title: "Type",
                name: "transType",
                type: "select",
                options: [
                    { value: "", label: "All" },
                    { value: "DR", label: "Debit" },
                    { value: "CR", label: "Credit" }
                ],
                inpprops: { md: 2 },
            },
            {
                title: "Bank",
                name: "bank",
                type: "text",
                inpprops: { md: 2 },
            },
            {
                title: "Party",
                name: "transParty",
                type: "text",
                inpprops: { md: 2 },
            }
        ],
    };
    const loadTransactions = useCallback(async () => {

        const data = await get(`${api}/bankTransaction/getAll?t=${Date.now()}`);
        if (response.ok && data) {
            setBankTransaction(data)
            // setAllTransactions(data);
        }
    }, [get, response]);
    useEffect(() => {
        loadTransactions();
    }, [loadTransactions]);
    const templateForTransactions = {
        fields: [

            {
                title: "customer Name",
                type: "select",
                name: "customerId",
                contains: "number",
                options: Customers,
                validationProps: "customer is required",
                inpprops: {},
            },
            {
                title: "Account No",
                type: "select",
                name: "companyBankAccountId",
                contains: "number",
                options: allBankAccounts,
                inpprops: {},
                validationProps: "Account No is required"
            },
            {
                title: "Payment Type",
                type: "select",
                name: "paymentType",
                contains: "number",
                inpprops: {},
                options: [
                    { value: "", label: "Select" },
                    { value: "DEBIT", label: "DEBIT" },
                    { value: "CREDIT", label: "CREDIT" },
                ],
                validationProps: "customer is required"
            },
            {
                title: "Transaction Date",
                type: "date",
                name: "transactionDate",
                contains: "date",
                inpprops: {},
                validationProps: "customer is required"
            },
            {
                title: "Amount",
                type: "number",
                name: "amount",
                contains: "number",
                options: [],
                inpprops: {},
                validationProps: "amount is required"
            },
            {
                title: "Tds",
                type: "number",
                name: "tds",
                contains: "number",
                options: [],
                inpprops: {},
                validationProps: "tds is required"
            },
            // {
            //     title: "Total",
            //     type: "number",
            //     name: "customername",
            //     contains: "number",
            //     options: [],
            //     validationProps: "total is required"
            // },
            {
                title: "Payment Mode",
                type: "select",
                name: "paymentModeId",
                contains: "number",
                options: paymentModeList,
                inpprops: {},
                validationProps: "paymentMode is required"
            },
            {
                title: "Reference No",
                type: "text",
                name: "referenceNo",
                contains: "text",
                options: [],
                inpprops: {},
                validationProps: "referenceNo is required"
            },
            {
                title: "Transaction Description",
                type: "text",
                name: "tarnsactionDescription",
                contains: "text",
                options: [],
                inpprops: {},
                // validationProps: "Description is required"
            },

        ]
    }

    const template = {
        fields: [

            {
                title: "From Date",
                type: "date",
                name: "fromDate",
                contains: "date",
                inpprops: {},
                validationProps: "date is required"
            },
            {
                title: "To Date",
                type: "date",
                name: "toDate",
                contains: "date",
                inpprops: {},
                validationProps: "date is required"
            },
            {
                // legend: "Transaction Details",
                title: "Transaction Type ",
                type: "select",
                name: "transactionType",
                contains: "text",
                options: [
                    { val: "CREDIT", label: "CREDIT" },
                    { val: "DEBIT", label: "DEBIT" }],
                validationProps: "Transaction Type  is required",
            },
            {
                // legend: "Transaction Details",
                title: "Bank",
                type: "text",
                name: "bank",
                contains: "text",
                validationProps: "Bank is required",
            },
        ],
    };


    //load curency from db
    const loadTransaction = useCallback(async () => {
        const allTransaction = await get(
            api + "/bankTransactionDetails/getAllTransaction"
        );
        console.table(allTransaction)
        if (response.ok) {
            // setTransaction(allTransaction);
            // setAllTransactions(allTransaction);
            let data = allTransaction;

            if (isReconcile) {
                const from = new Date();
                from.setDate(from.getDate() - 7);

                data = data.filter(t =>
                    new Date(t.transactionDate) >= from
                );
            }
            if (transactionTypeFilter) {
                data = data.filter(
                    t =>
                        t.transactionType &&
                        t.transactionType.toUpperCase() === transactionTypeFilter.toUpperCase()
                );
            }

            setTransaction(data);
            setAllTransactions(data);

            console.log("res is pass", response)

        } else {
            // AlertHandler("failed to get the Transaction", "danger")
            console.log("res is failed", response)
        }


    }, [get, response, isReconcile, refreshKey])



    useEffect(() => {
        loadTransaction();
    }, [loadTransaction, refreshKey]);



    useEffect(() => {
        if (selectedId && allTransactions.length > 0) {
            const matchingTxn = allTransactions.find(
                (t) => String(t.transactionId) === String(selectedId)
            );

            if (matchingTxn) {
                setSelectedTransactionId(matchingTxn.transactionId);
                if (onRowSelect) {
                    onRowSelect(matchingTxn);
                }
            }
        }
    }, [selectedId, allTransactions, onRowSelect]);


    const rowWiseFields = 3;
    const rowColors = ["#fff"];
    function validate() {

    }

    const saveTransactions = useCallback(async (values) => {

        const res = await post(api + "/bankTransactionDetails/createTransaction", values);
        console.log("=== values===")
        console.table(values)
        console.log('res====')
        console.table(res)
        if (response.ok) {
            setTransaction(res);
            setAllTransactions(res);
            await loadTransaction();
            AlertHandler("Transaction Created Succusfully", "success")
        }
        else {
            setTransaction([]);
            setAllTransactions([]);
            await loadTransaction();
            AlertHandler("Transaction Created failed", "danger")

        }
    })

    const searchDetails = async (values) => {

        if (!isMapped && !isReconcile) {
            let filtered = [...bankTransaction];

            if (values.fromDate) {
                const from = new Date(values.fromDate).setHours(0, 0, 0, 0);
                filtered = filtered.filter(t =>
                    new Date(t.transDate).setHours(0, 0, 0, 0) >= from
                );
            }

            if (values.toDate) {
                const to = new Date(values.toDate).setHours(0, 0, 0, 0);
                filtered = filtered.filter(t =>
                    new Date(t.transDate).setHours(0, 0, 0, 0) <= to
                );
            }

            if (values.transType) {
                const type = values.transType.toLowerCase();
                filtered = filtered.filter(
                    t => t.transType?.toLowerCase() === type
                );
            }

            if (values.bank) {
                filtered = filtered.filter(t =>
                    t.bank?.toLowerCase().includes(values.bank.toLowerCase())
                );
            }

            if (values.transParty) {
                filtered = filtered.filter(t =>
                    t.transParty?.toLowerCase().includes(values.transParty.toLowerCase())
                );
            }

            setBankTransaction(filtered);
        } else {
            let filtered = allTransactions;

            if (values.fromDate) {
                const from = new Date(values.fromDate);
                filtered = filtered.filter(t => new Date(t.transactionDate) >= from);
            }
            if (values.toDate) {
                const to = new Date(values.toDate);
                filtered = filtered.filter(t => new Date(t.transactionDate) <= to);
            }


            if (values.transactionType) {
                const type = values.transactionType.toLowerCase();
                filtered = filtered.filter(t => t.transactionType?.toLowerCase().includes(type));
            }


            if (values.bank) {
                const bank = values.bank.toLowerCase();
                filtered = filtered.filter(t => t.bank?.toLowerCase().includes(bank));
            }

            setTransaction(filtered);
        }
    };




    function onSubmit(values) {
        console.log(values);

        searchDetails(values);
    }



    const showFormHandler = (item, action) => () => {
        const isEdit = action === "Edit";
        const formData = isEdit ? { ...item } : {};

        if (action === "Link") {
            setSelectedTransactionId(item.transactionId);
            props.onTransactionSelect && props.onTransactionSelect(item);
        }
        if (action === "Add") {
            setShowSlider(true);
            setSliderContent(
                <NewTransaction
                    template={templateForTransactions}
                    selectedItem={{}}
                    validate={validate}
                    saveTransactions={saveTransactions}
                    onCancel={() => setShowSlider(false)}
                />)
        }
        if (action === "Mapping") {

            setShowSlider(true);
            setSliderContent(
                <div className={classes.container}>
                    <Popupcard
                        title="Add New Invoice Mapping"
                        showBack={true}
                        onBack={() => setShowSlider(false)}
                    >
                        <AddNewInvoice
                            customerId={{ customerId: item.customerId || item.customer?.customerId }}
                            selectedItem={item}
                            loadTransaction={loadTransaction}
                            onCancel={() => setShowSlider(false)}
                        />
                    </Popupcard>
                </div>
            );

        }

        if (action === "MappedLink") {
            setShowSlider(true);
            setSliderContent(
                <div className={classes.container}>
                    <Popupcard
                        title="Transaction Mapping History"
                        showBack={true}
                        onBack={() => setShowSlider(false)}>
                        <ReconcileMapping
                            transactionId={item.transactionId}
                            transactionAmount={item.balanceAmount}
                            onBack={() => setShowSlider(false)}
                        />
                    </Popupcard>
                </div>
            );
        }

    };

    const actions = ["Link", "MappedLink", "Mapping"];
    const handleRowClick = (row) => {
        if (!singleSelect) return;

        setSelectedTransactionId(row.transactionId);
        onRowSelect && onRowSelect(row);
    };


    return (
        <div className={classes.container}>
            {!showSlider && (<NewTable
                cols={ViewTransactionTable(
                    showFormHandler,
                    actions
                    , isReconcile,
                    selectedTransactionId,
                    props.onDebitTypeChange,
                    isMapped
                )}
                enableSearch={false}
                selectedRowId={selectedTransactionId}
                // data={transaction}
                data={(!isMapped && !isReconcile) ? bankTransaction : transaction}
                hideSNo={isReconcile}
                // onRowClick={props.onRowClick}
                onRowClick={handleRowClick}
                striped
                includeCheck={isReconcile ? 1 : null}
                // checkBoxEvent={isReconcile ? onCheckBoxEvent : undefined}
                checkBoxEvent={(row, checked) => {
                    if (checked && onRowSelect) {
                        onRowSelect(row);
                    }
                }}
                rowwise={3}
                rows={15}
                title={(!isMapped && !isReconcile) ? "View Transaction" : "Payment Transactions"}
                // title={props.isReconcile ? "Reconcile Transaction Details" : props.isMapped ? "Reconcile Transaction " : "Transaction Details"}
                // title= props.isReconcile ? " Reconsile Transaction Details":"Transaction Details"
                showPlusCircle={(!isMapped && !isReconcile) ? false : true}
                handleAddClick={showFormHandler({}, "Add")}
                template={(!isMapped && !isReconcile) ? filterTemplate : template}
                // rowwise={rowWiseFields}
                validate={validate}
                onSubmit={onSubmit}
                onCancel={props.onCancel}
                showFilterIcon={!isReconcile}
            // buttonName="Search"
            />)}
            {showSlider && (
                <div style={{ width: "100%", background: "#fff" }}>

                    {sliderContent}
                </div>
            )}

        </div>
    )
}
export default ViewTransaction;