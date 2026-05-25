import React, { useCallback, useEffect, useState } from "react";
import {
    CreateForm,
    api,
    useFetch,
    alertActions,
    modalActions,
    useDispatch,
    useSelector,
    classes,
    Popupcard,
} from "../../Components/CommonImports/CommonImports";
import NewTable from "../../Components/NewTable/NewTable";

import SalesPaymentReconsile from "./SalesPaymentReconsile";

import MakePaymentSalesTable from "./MakePaymentSalesTable";

import Upload from "./Upload";
import TransactionMapping from "./TransactionMapping";

const MakePaymentSales = () => {
    const { get, post, del, response } = useFetch({ data: [] });
    const dispatch = useDispatch();
    //   const invoiceHeaderId = selectedItem?.invoiceHeaderId;
    const [Payment, setPayment] = useState([]);
    const [Saless, setSaless] = useState([]);
    const [allSales, setAllSales] = useState([]);
    const [Customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({});
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSalesPaymentSaved = () => {
        setRefreshKey(prev => prev + 1);
        loadSaless();
    };
    /* ? Slide State */
    const [isSlideOpen, setIsSlideOpen] = useState(false);
    const [activeForm, setActiveForm] = useState(null);

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

    // data.map(s => ({ value: s.id, label: s.CustomerName }
    const loadpayment = useCallback(async () => {
        const data = await get(api + "/paymentDetails/getAll?t=" + Date.now());

        console.log(" data for payments details load ", data)
        if (response.ok)
            setPayment(data);
    }, [get, response]);

    useEffect(() => {
        loadpayment();
    }, [loadpayment]);

    // Load Customers
    const loadCustomers = useCallback(async () => {
        const data = await get(api + "/customer/getall?t=" + Date.now());
        console.log(".customer ", data)
        if (response.ok)
            setCustomers([
                { value: "", label: "Select" },
                ...data.map(s => ({
                    value: s.customerId,
                    label: s.customerName
                }))
            ]);

    }, [get, response]);

    useEffect(() => {
        loadCustomers();

    }, [loadCustomers]);



    const loadSaless = useCallback(async () => {
        const data = await get(api + "/invoiceHeader/getAll/SALES?t=" + Date.now());
        console.log(" all data ..", data)
        console.table(data)
        if (response.ok) {
            // if (Array.isArray(data)) {
            //   const newData = data.map(invoice => {

            //     return {
            //       ...invoice,

            //     }
            //   })
            console.log("new data all", data)
            setSaless(data)
            setAllSales(data);
            // }


        }

        // setSaless(...data,Customers);
    }, [get, response]);

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

    const filterTemplate = {
        fields: [
            {
                title: "From Date",
                name: "fromDate",
                type: "date",
                inpprops: {},
            },
            {
                title: "To Date",
                name: "toDate",
                type: "date",
                inpprops: {},
            },
            {
                title: "Customer Name",
                type: "select",
                name: "customerId",
                options: Customers,
            }

        ],
    };


    const templatePayement = {
        fields: [


            {
                title: "Payment Date",
                name: "paymentDate",
                type: "date",
                contains: "date",
                options: [],
                inpprops: { md: 3, },

            },

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

            // {
            //     options: [],
            //     title: "Balance Amount",
            //     name: "balanceAmount",
            //     type: "number",
            //     inpprops: { md: 12, rows: 4 },
            //     validationProps: "Item description is required"
            // },
            // {
            //     options: [],
            //     title: "Paid Amount",
            //     name: "paidAmount",
            //     type: "number",
            //     inpprops: { md: 12, rows: 4 },
            //     validationProps: "Paid Amount is required"
            // },
            //  { options: [],
            //     title: "Reference",
            //     name: "itemDesc",
            //     type: "number",
            //     inpprops: { md: 12, rows: 4 },
            //     validationProps: "Item description is required"
            // },
            //  { options: [],
            //     title: "Bank name",
            //     name: "itemDesc",
            //     type: "select",
            //     inpprops: { md: 12, rows: 4 },
            //     validationProps: "Item description is required"
            // },

            {
                options: [],
                title: "remark",//remarker
                name: "remark",
                type: "text",
                inpprops: { md: 12, rows: 4 },
                validationProps: "Item description is required"
            },

        ]
    }
    const savepayment = async (payment) => {
        let result;
        console.log("===makepayment", payment)
        if (payment.id) {
            result = await post(api + "/payment/update/" + payment.id, payment);
        } else {
            result = await post(api + "/payment/create", payment);
        }
        if (response.ok) {
            AlertHandler("payment saved successfully", "success");
            loadpayment();
        } else {
            AlertHandler("Failed to save payment", "danger");
        }
    };




    // const loadPaymentSummary = useCallback(async () => {
    //     if (!invoiceHeaderId) return;

    //     const data = await get(api + "/paymentDetails/byHeader/" + invoiceHeaderId);
    //     if (response.ok && data) {
    //         // setPaymentFormData(da ta);
    //         setFormData(prev => ({
    //             ...prev,
    //             balanceAmount: data.balanceAmount,
    //             paidAmount: data.advance,
    //         }));
    //     }
    // }, [get, response, invoiceHeaderId]);

    // useEffect(() => {
    //     // loadPayment();
    //     loadPaymentSummary();
    // }, [loadPaymentSummary])

    const showFormHandler = (payment, actions) => () => {
        const closeSlide = () => {
            setIsSlideOpen(false);
            setActiveForm(null);
            loadSaless();
        };

        if (actions === "Transaction") {
            setActiveForm(
                <TransactionMapping
                    selectedTransaction={payment}
                    onClose={closeSlide}
                />
            );
            setIsSlideOpen(true);
        }

        if (actions === "upload") {
            setActiveForm(
                <Upload
                    referenceId={payment.invoiceHeaderId || payment.invoiceHeader?.invoiceHeaderId}
                    referenceType="SALES_PAYMENT"
                    uploadTitle="SALES Invoice PAYMENT Upload"
                    financialYear={payment.invoiceHeader?.invoiceDate}
                    onCancel={closeSlide}
                />
            );
            setIsSlideOpen(true);
        }

        if (actions === "Payment") {
            setActiveForm(
                <SalesPaymentReconsile
                    payment={payment}
                    savepayment={savepayment}
                    templatePayement={templatePayement}
                    onPaymentSaved={loadSaless}
                    onClose={closeSlide}

                />
            );
            setIsSlideOpen(true);
        }
    };
    const onSubmit = async (values) => {
        const searchPayload = {
            fromDate: values.fromDate || null,
            toDate: values.toDate || null,
            customerId: values.customerId || null,
            type: "SALES"
        };

        const result = await post(api + "/invoiceHeader/search", searchPayload);
         console.log(" res for filt",result)
        if (response.ok) {
            setSaless(result || []);
        } else {
            setSaless([]);
            // AlertHandler("Search failed", "danger");
        }
    };

    // const onSubmit = (values) => {
    //     const { fromDate, toDate, customerId } = values;

    //     if (!fromDate && !toDate && !customerId) {
    //         setSaless(allSales);
    //         return;
    //     }

    //     const filtered = allSales.filter((item) => {
    //         const header = item.invoiceHeader ? item.invoiceHeader : item;

    //         const itemCustomerId =
    //             header.customerId || header.customer?.customerId;

    //         const customerMatch = customerId
    //             ? String(itemCustomerId) === String(customerId)
    //             : true;

    //         let dateMatch = true;
    //         if (header.invoiceDate) {
    //             const itemDate = new Date(header.invoiceDate).setHours(
    //                 0,
    //                 0,
    //                 0,
    //                 0
    //             );
    //             const from = fromDate
    //                 ? new Date(fromDate).setHours(0, 0, 0, 0)
    //                 : null;
    //             const to = toDate
    //                 ? new Date(toDate).setHours(0, 0, 0, 0)
    //                 : null;

    //             dateMatch =
    //                 (!from || itemDate >= from) && (!to || itemDate <= to);
    //         }

    //         return customerMatch && dateMatch;
    //     });

    //     setSaless(filtered);
    // };



    function validate() {

    }



    const MakePaymentSaleFilter = {
        fields: [
            {
                title: "From Date",
                name: "fromDate",
                type: "date",
                inpprops: {},
            },
            {
                title: "To Date",
                name: "toDate",
                type: "date",
                inpprops: {},
            },
            {
                title: "Customer Name",
                type: "select",
                name: "customerId",
                options: Customers,
            }

            // {
            //   title: "Bank Name",
            //   name: "bankName",
            //   type: "select",
            //   options: Payment, 
            //   inpprops: {},
            // },
            // {
            //   title: "Payment Mode",
            //   name: "paymentMode",
            //   type: "select",
            //   options: [
            //     { value: "Cash", label: "Cash" },
            //     { value: "Bank Transfer", label: "Bank Transfer" },
            //     { value: "Cheque", label: "Cheque" },
            //   ],
            //   inpprops: {},
            // },
        ],
    };
    const actions = ["upload", "Payment", "Transaction"];
    return (
        <div className={classes.container} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
            <div style={{
                transition: "0.4s ease",
                opacity: isSlideOpen ? 0 : 1,
                pointerEvents: isSlideOpen ? "none" : "auto",
            }}>
                <NewTable
                    cols={MakePaymentSalesTable(showFormHandler, actions)}
                    data={Saless}
                    striped
                    title="Make Sales Payment"
                    // showPlusCircle={true}
                    handleAddClick={showFormHandler({}, "Add")}
                    template={filterTemplate}
                    rowwise={3}
                    rows={100}
                    onSubmit={onSubmit}
                    buttonName="Search"
                    validate={validate}
                />
            </div>
            {/* ? Slide Popup */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "100%",
                    height: "100%",
                    transform: isSlideOpen
                        ? "translateX(0%)"
                        : "translateX(100%)",
                    transition: "0.4s ease-in-out",
                    zIndex: 999,
                    overflowY: "auto",
                }}
            >
                {activeForm}
            </div>
        </div>

    )
}
export default MakePaymentSales;