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


import MakePaymentPurchaseTable from "./MakePaymentPurchaseTable";
import NewPurchasePayment from "./NewPurchasePayment";
import Upload from "./Upload";
import PurchasePaymentReconsile from "./PurchasePaymentReconsile";

const MakePaymentPurchase = () => {
    const { get, post, del, response } = useFetch({ data: [] });
    const dispatch = useDispatch();
    /* ? Slide State */
    const [isSlideOpen, setIsSlideOpen] = useState(false);
    const [activeForm, setActiveForm] = useState(null);


    const [Payment, setPayment] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [allPurchases, setAllPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
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

    // Load suppliers
    const loadSuppliers = useCallback(async () => {
        const data = await get(api + "/supplier/getall");
        console.log(".suplier ", data)
        if (response.ok) setSuppliers(data.map(s => ({ value: s.supplierId, label: s.supplierName })));
    }, [get, response]);



    useEffect(() => {
        loadSuppliers();

    }, [loadSuppliers]);



    const loadPurchases = useCallback(async () => {
        // const data = await get(api + "/invoiceHeader/getAll/" + "PURCHASE");

        const val = {
            type: "PURCHASE",
            isFilter: "NO"
        }
        const data = await post(api + "/invoiceHeader/getAll/", val);
        // const data = await get(api + `/makePayment/getAll/PURCHASE?rand=${Math.random()}`)
        console.log(" all data  purch..", data)
        if (response.ok) {

            setPurchases(data||[])

            // }


        }

        const value = {
            type: "PURCHASE",
            isFilter: "YES"
        }
        const dataFilter = await post(api + "/invoiceHeader/getAll/", value);
        if (dataFilter) {
            setAllPurchases(dataFilter||[]);
        }
        // setPurchases(...data,suppliers);
    }, [get, response]);

    useEffect(() => {
        loadPurchases();
    }, [loadPurchases]);

    const [paymentModeList, setPaymentModeList] = useState([]);

    const loadPaymentModes = useCallback(async () => {
        const res = await get(api + "/paymentMode/getall");
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
                options: [],
                name: "paymentModeId",
                type: "select",
                inpprops: { md: 12, rows: 4 },
                options: paymentModeList,
                validationProps: "payment Mode is required"
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
                validationProps: "Tds is required"
            },

            // {
            //     options: [],
            //     title: "Balance Amount",
            //     name: "balanceAmount",
            //     type: "number",
            //     inpprops: { md: 12, rows: 4 },
            //     validationProps: "balance Amount  is required"
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
                type: "number",
                inpprops: { md: 12, rows: 4 },
                validationProps: "remark is required"
            },

        ]
    }
    const handlePaymentSaved = () => {
        loadPurchases();
    }
    const showFormHandler = (rowData, actions) => () => {
        const closeSlide = () => {
            setIsSlideOpen(false);
            setActiveForm(null);
            loadPurchases();
        };
        if (actions === "Delete") {
            // deletepayment(payment.id);
        }

        if (actions === "upload") {
            setActiveForm(
                <Upload
                    referenceId={rowData.invoiceHeaderId || rowData.invoiceHeader?.invoiceHeaderId}
                    referenceType="PURCHASE_PAYMENT"
                    uploadTitle="Purchase Invoice  PAYMENT Upload"
                    financialYear={rowData.invoiceHeader?.invoiceDate}

                    onClose={closeSlide}
                    //  template={templatePayement} 
                    validate={validate}
                />
            )
            setIsSlideOpen(true);

        }
        if (actions === "Payment") {
            setActiveForm(
                <PurchasePaymentReconsile
                    // payment={payment}
                    selectedItem={rowData}
                    onPaymentSaved={handlePaymentSaved}
                    // savepayment={savepayment}
                    templatePayement={templatePayement}
                    validate={validate}
                    onClose={closeSlide}
                />
            )
            setIsSlideOpen(true);
        }
    };


    function onSubmit(values) {
        console.log("Search/filter values:", values);

        const { fromDate, toDate, supplierId } = values;
        if (!fromDate && !toDate && !supplierId) {
            setPurchases(allPurchases);
            return;
        }

        const filtered = allPurchases.filter((item) => {
            const header = item.invoiceHeader || {};
            const itemSupplierId = header.supplierId || header.supplier?.supplierId;
            const supplierMatch = supplierId
                ? String(itemSupplierId) === String(supplierId)
                : true;
            let dateMatch = true;
            if (header.invoiceDate) {
                const itemDate = new Date(header.invoiceDate).setHours(0, 0, 0, 0);
                const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
                const to = toDate ? new Date(toDate).setHours(0, 0, 0, 0) : null;

                const isAfterFrom = from ? itemDate >= from : true;
                const isBeforeTo = to ? itemDate <= to : true;

                dateMatch = isAfterFrom && isBeforeTo;
            } else if (fromDate || toDate) {
                dateMatch = false;
            }


            return supplierMatch && dateMatch;
        });


        setPurchases(filtered);
    }

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
            // {
            //     title: "Supplier Name",
            //     type: "select",
            //     name: "supplierId",
            //     contains: "select",
            //     options: suppliers,
            //     validationProps: "Supplier is required",
            // },

        ],
    };
    const actions = ["upload", "Payment"];
    return (
        <div className={classes.container} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
            <div style={{
                transition: "0.4s ease",
                opacity: isSlideOpen ? 0 : 1,
                pointerEvents: isSlideOpen ? "none" : "auto",
            }}>
                <NewTable
                    cols={MakePaymentPurchaseTable(showFormHandler, actions)}
                    data={purchases}
                    striped
                    title="Make Purchase Payment"
                    // showPlusCircle={true}
                    handleAddClick={showFormHandler({}, "Add")}
                    template={MakePaymentSaleFilter}
                    rowwise={3}
                    rows={10}
                    onSubmit={onSubmit}
                    buttonName="Search123"
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
export default MakePaymentPurchase;