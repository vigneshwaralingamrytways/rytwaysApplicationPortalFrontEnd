import React, { useState, useCallback, useEffect, useRef } from "react";
// import NewTable from "../../Components/NewTable/NewTable";
// import { api, useFetch } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";

import ViewdDocumentsTable from "./ViewDocumentsTable";
import {
    CreateForm,
    api,
    useFetch,
    alertActions,
    modalActions,
    useDispatch,
    useSelector,

    Popupcard,
} from "../../Components/CommonImports/CommonImports";
// import NewTable from "../../Components/NewTable/NewTable";
// import Upload from "./Upload";
import ManageSalesTable from "./ManageSalesTable";
import NewSales from "./NewSales";
import NewTable from "../../Components/NewTable/NewTable";
import Upload from "./Upload";
import ManagePurchaseTable from "./ManagePurchaseTable";
import NewPurchase from "./NewPurchase";
import NewPurchasePayment from "./NewPurchasePayment";
import { saveAs } from 'file-saver';
import GstReportsable from "./GstReportsTable";
import GstReportsTable from "./GstReportsTable";
import * as XLSX from "xlsx";
const ManageGstReports = ({ document, onCancel }) => {
    const { get, post, del, response } = useFetch({ data: [] });
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
    const isGst = true;

    const [filterFromDate, setFilterFromDate] = useState("");
    const [filterToDate, setFilterToDate] = useState("");
    const [previewPopup, setPreviewPopup] = useState(false);
    const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
    const [sheets, setSheets] = useState([]);
    const [activeSheet, setActiveSheet] = useState(0);
    const blobUrlRef = useRef(null);
    const [Saless, setSaless] = useState([]);
    const [allSales, setAllSales] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [GstReports, SetGstReports] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [allPurchases, setAllPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    // Load suppliers
    const loadSuppliers = useCallback(async () => {
        const data = await get(api + "/supplier/getall");
        console.log(".suplier ", data)
        if (response.ok) setSuppliers(data.map(s => ({ value: s.supplierId, label: s.supplierName })));
    }, [get, response]);

    // Load Customers
    const loadCustomers = useCallback(async () => {
        const data = await get(api + "/customer/getall");
        console.log(".customer ", data)
        if (response.ok) setCustomers(data.map(s => ({ value: s.customerId, label: s.customerName })));
    }, [get, response]);





    useEffect(() => {
        loadSuppliers();
        loadCustomers();
    }, [loadSuppliers, loadCustomers]);



    const loadGstReports = useCallback(async (fromDate = null, toDate = null) => {
        const payload = {
            fromDate: fromDate || null,
            toDate: toDate || null
        };
        const data = await post(api + "/invoiceHeader/gstReport", payload);
        if (response.ok) {
            SetGstReports(data);
        }
    }, [post, response.ok]);



    useEffect(() => {
        loadGstReports();

    }, [loadGstReports]);




    const validate = () => {

    }


    const loadPurchases = useCallback(async () => {
        const data = await get(api + "/invoiceHeader/getAll/PURCHASE");
        console.log(" all data ..", data)
        if (response.ok) {

            console.log("new data all", data)


            //   const merged = [];
            //    for (let i = 0; i < data.length; i++) {
            //   const inv = data[i];

            //   let payment = null;

            //   try {
            //     payment = await get(
            //       api + "/paymentDetails/byHeader/" + inv.invoiceHeaderId
            //     );
            //   } catch (e) {
            //     console.log("payment error", e);
            //   }

            //   merged.push({
            //     ...inv,
            //     grossAmount: payment?.grossAmount || 0,
            //     totalGst: payment?.totalGst || 0,
            //     netTotal: payment?.netTotal ||0,
            //     advance: payment?.advance|| 0,
            //     balanceAmount: payment?.balanceAmount || 0,
            //   });
            // }

            //     console.log("new data all", data)
            //      setPurchases(merged);
            //      console.log("merged",merged)

            setPurchases(data)
            setAllPurchases(data);
            // }


        }

        // setPurchases(...data,suppliers);
    }, [get]);

    useEffect(() => {
        loadPurchases();
    }, [loadPurchases]);





    const handleDownload = async (rowData) => {
        try {
            const res = await get(api + `/document/download/${rowData.documentId}`);
            if (response.ok) {
                const blob = await response.blob();
                saveAs(blob, `${rowData.documentTitle}.pdf`);
            } else {
                AlertHandler("Failed to download file", "danger");
                console.log("fail to docnlods", response)
            }
        } catch (err) {
            console.log("errors,", err);
        }
    };

    const showFormHandler = (rowData) => () => {
        handleDownload(rowData);
    };


    function onSubmitPurchase(values) {
        const { fromDate, toDate, supplierId } = values;

        if (!fromDate && !toDate && !supplierId) {
            setPurchases(allPurchases);
            return;
        }

        const filtered = allPurchases.filter((item) => {
            const header = item.invoiceHeader ? item.invoiceHeader : item;

            const itemSupplierId = header.supplierId || header.supplier?.supplierId;
            const supplierMatch = supplierId
                ? String(itemSupplierId) === String(supplierId)
                : true;

            let dateMatch = true;
            if (header.invoiceDate) {
                const itemDate = new Date(header.invoiceDate).setHours(0, 0, 0, 0);
                const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
                const to = toDate ? new Date(toDate).setHours(0, 0, 0, 0) : null;

                dateMatch = (!from || itemDate >= from) && (!to || itemDate <= to);
            }

            return supplierMatch && dateMatch;
        });

        setPurchases(filtered);
    }

    const template = {
        fields: [
            {
                title: "Total Gross",
                name: "totalGross",
                type: "text",
                inpprops: { readOnly: true },
            },
            {
                title: "Total CGST",
                name: "totalCGST",
                type: "text",
                inpprops: { readOnly: true },
            },
            {
                title: "Total SGST",
                name: "totalSGST",
                type: "text",
                inpprops: { readOnly: true },
            },
            {
                title: "Total IGST",
                name: "totalIGST",
                type: "text",
                inpprops: { readOnly: true },
            },
            {
                title: "Total GST",
                name: "totalGST",
                type: "text",
                inpprops: { readOnly: true },
            },
        ],
    };


    const templatePurchase = {
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
                title: "Supplier Name",
                type: "select",
                name: "supplierId",
                options: suppliers,
            },
        ],
    };


    const templateSale = {
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
                title: "Customer",
                name: "customerId",
                type: "select",
                contains: "select",
                options: customers,
                inpprops: {},
            },
        ],
    };

    const gstReportFilterTemplate = {
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
        ],
    };





    const handleExcel = async (rowData) => {
        try {
            setSheets([]);
            setActiveSheet(0);
            setPreviewPopup(true);
            setPreviewBlobUrl(null);

            const payload = {
                fromDate: filterFromDate || null,
                toDate: filterToDate || null
            };
            // const res = await get(api + `/invoiceHeader/print/${rowData.invoiceHeader?.invoiceHeaderId||rowData.invoiceHeaderId}`);
            // const result = await get(api + "/invoiceHeader/download/excel/combinedGstReport");
            const result = await post(api + "/invoiceHeader/download/excel/combinedGstReport", payload);
            // if (response.ok) {

            //     const blob = await response.blob();
            //     saveAs(blob, "combinedGstReport.xlsx");
            // } 
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                if (blobUrlRef.current) window.URL.revokeObjectURL(blobUrlRef.current);
                blobUrlRef.current = url;
                setPreviewBlobUrl(url);

                const arrayBuffer = await blob.arrayBuffer();
                const data = new Uint8Array(arrayBuffer);
                const workbook = XLSX.read(data, { type: "array" });
                const parsedSheets = workbook.SheetNames.map((name) => ({
                    name,
                    html: XLSX.utils.sheet_to_html(workbook.Sheets[name]),
                }));
                setSheets(parsedSheets);
            }
            else {
                setPreviewPopup(false);
                AlertHandler("Failed to download file", "danger");
                console.log("fail to docnlods", response)
            }
        } catch (err) {
            setPreviewPopup(false);
            console.log("errors,", err);
        }
    };
    const closePreviewPopup = () => {
        setPreviewPopup(false);
        setSheets([]);
        setActiveSheet(0);
        if (blobUrlRef.current) {
            window.URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
        setPreviewBlobUrl(null);
    };

    const handleDownloadFallback = () => {
        if (blobUrlRef.current) {
            saveAs(previewBlobUrl, "combinedGstReport.xlsx");
        }
    };

    const loadSaless = useCallback(async () => {
        const data = await get(api + "/invoiceHeader/getAll/SALES");

        console.log(" all data ..", data)
        if (response.ok) {


            console.log("new data all", data)
            //      setSaless(merged);
            //  console.log("merged",merged)
            setSaless(data)
            setAllSales(data);
            // }


        }

        // setSaless(...data,Customers);
    }, [get, response]);

    useEffect(() => {
        loadSaless();
    }, [loadSaless]);

    const calculateTotals = (list = []) => {
        return list.reduce(
            (acc, item) => {
                acc.gross += Number(item.grossAmount || 0);
                acc.cgst += Number(item.cgst || 0);
                acc.sgst += Number(item.sgst || 0);
                acc.igst += Number(item.igst || 0);
                acc.totalGst += Number(item.totalGst || 0);
                return acc;
            },
            { gross: 0, cgst: 0, sgst: 0, igst: 0, totalGst: 0 }
        );
    };
    const salesTotals = calculateTotals(Saless);
    const purchaseTotals = calculateTotals(purchases);

    const netTotals = {
        gross: salesTotals.gross - purchaseTotals.gross,
        cgst: salesTotals.cgst - purchaseTotals.cgst,
        sgst: salesTotals.sgst - purchaseTotals.sgst,
        igst: salesTotals.igst - purchaseTotals.igst,
        totalGst: salesTotals.totalGst - purchaseTotals.totalGst,
    };

    const actions = ["Edit", "Add", "Upload", "Delete"];

    const onSubmitSales = (values) => {
        const { fromDate, toDate, customerId } = values;

        if (!fromDate && !toDate && !customerId) {
            setSaless(allSales);
            return;
        }

        const filtered = allSales.filter((item) => {
            const header = item.invoiceHeader ? item.invoiceHeader : item;

            const itemCustomerId = header.customerId || header.customer?.customerId;
            const customerMatch = customerId
                ? String(itemCustomerId) === String(customerId)
                : true;

            let dateMatch = true;
            if (header.invoiceDate) {
                const itemDate = new Date(header.invoiceDate).setHours(0, 0, 0, 0);
                const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
                const to = toDate ? new Date(toDate).setHours(0, 0, 0, 0) : null;

                dateMatch = (!from || itemDate >= from) && (!to || itemDate <= to);
            }

            return customerMatch && dateMatch;
        });

        setSaless(filtered);
    };

    const onSubmitGstFilter = async (values) => {
        const { fromDate, toDate } = values;

        setFilterFromDate(fromDate || "");
        setFilterToDate(toDate || "");

        const payload = {
            fromDate: fromDate || null,
            toDate: toDate || null
        };

        try {
            const result = await post(api + "/invoiceHeader/getGstFilteredData", payload);
            if (response.ok && result) {
                setSaless(result.sales || []);
                setPurchases(result.purchases || []);
                await loadGstReports(fromDate, toDate);
            } else {
                AlertHandler("Failed to filter GST data summaries", "danger");
            }
        } catch (error) {
            console.error("Filter request invocation crash:", error);
        }
    };
    return (
        <div className={classes.container}>
            {/* <Popupcard title={"View Document"}> */}

            <NewTable
                cols={ManageSalesTable(showFormHandler, actions, isGst)}
                data={Saless}
                striped
                title="Manage Sales"
                // showExcelIcon={true}
                handleExcelIcon={() => { }}
                // showPlusCircle={true}
                // handleAddClick={showFormHandler({}, "Add")}
                template={templateSale}
                rowwise={3}
                rows={10}
                onSubmit={onSubmitSales}
                buttonName="Search"
                validate={validate}
                showFilterIcon={false}
            />

            <NewTable
                cols={ManagePurchaseTable(showFormHandler, actions, isGst)}
                data={purchases}
                striped
                title="Manage Purchase"
                // showExcelIcon={true}
                // handleExcelIcon={() => { }}
                // showPlusCircle={true}
                // handleAddClick={showFormHandler({}, "Add")}
                template={templatePurchase}
                rowwise={3}
                rows={10}
                onSubmit={onSubmitPurchase}
                buttonName="Search"
                validate={validate}
                showFilterIcon={false}
            />


            <NewTable
                cols={GstReportsTable(showFormHandler, actions, isGst)}
                data={GstReports}
                striped
                title="Manage GstReports"
                showExcelIcon={true}
                handleExcelIcon={handleExcel}
                // showPlusCircle={true}
                // handleAddClick={showFormHandler({}, "Add")}
                // template={filterTemplate}
                template={gstReportFilterTemplate}
                rowwise={3}
                rows={3}
                // onSubmit={onSubmit}
                onSubmit={onSubmitGstFilter}
                buttonName="Search"
                validate={validate}
            // showFilterIcon={false}
            />
            {previewPopup && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
                    background: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center", alignItems: "center",
                    zIndex: 99999
                }}>
                    <div style={{
                        width: "85vw", height: "85vh", padding: "20px", borderRadius: "12px",
                        background: "#1e1e2f", display: "flex", flexDirection: "column", gap: "15px"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
                                Combined GST Report Preview
                            </span>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleDownloadFallback}
                                    style={{ padding: "6px 15px", fontSize: "13px" }}
                                >
                                    Download Excel
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={closePreviewPopup}
                                    style={{ padding: "6px 15px", fontSize: "13px" }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, background: "#fff", borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                            {sheets.length === 0 ? (
                                <div style={{ color: "#333", textAlign: "center", paddingTop: "20%", flex: 1 }}>
                                    Parsing Spreadsheet Data...
                                </div>
                            ) : (
                                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                                    <div style={{ display: "flex", borderBottom: "1px solid #ccc", overflowX: "auto", flexShrink: 0, background: "#f3f4f6" }}>
                                        {sheets.map((sheet, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setActiveSheet(idx)}
                                                style={{
                                                    padding: "8px 16px",
                                                    cursor: "pointer",
                                                    whiteSpace: "nowrap",
                                                    fontSize: "13px",
                                                    fontWeight: activeSheet === idx ? 700 : 400,
                                                    color: activeSheet === idx ? "#000" : "#666",
                                                    borderBottom: activeSheet === idx ? "3px solid #007bff" : "3px solid transparent",
                                                    transition: "all 0.15s",
                                                }}
                                            >
                                                {sheet.name}
                                            </div>
                                        ))}
                                    </div>
                                    <div
                                        style={{ flex: 1, overflow: "auto", padding: "10px", color: "#000" }}
                                        className="gst-excel-preview-wrapper"
                                        dangerouslySetInnerHTML={{ __html: sheets[activeSheet]?.html }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <style>{`
                        .gst-excel-preview-wrapper table { border-collapse: collapse; font-size: 13px; width: 100%; }
                        .gst-excel-preview-wrapper td, .gst-excel-preview-wrapper th { border: 1px solid #ddd; padding: 6px 10px; white-space: nowrap; text-align: left; }
                        .gst-excel-preview-wrapper th { background-color: #f9fafb; font-weight: bold; }
                    `}</style>
                </div>
            )}
        </div>
    );
};

export default ManageGstReports;
