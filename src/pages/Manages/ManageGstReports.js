import React, { useState, useCallback, useEffect } from "react";
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

const ManageGstReports = ({ document, onCancel }) => {
    const { get, response } = useFetch({ data: [] });
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
    const [Saless, setSaless] = useState([]);
    const [Customers, setCustomers] = useState([]);

    const [GstReports, SetGstReports] = useState([]);
    const [purchases, setPurchases] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    // Load suppliers
    const loadSuppliers = useCallback(async () => {
        const data = await get(api + "/supplier/getall");
        console.log(".suplier ", data)
        if (response.ok) setSuppliers(data.map(s => ({ value: s.supplierId, label: s.supplierName })));
    }, [get, response]);



    useEffect(() => {
        loadSuppliers();

    }, [loadSuppliers]);



    const loadGstReports = useCallback(async () => {
        const data = await get(api + "/invoiceHeader/gstReport");
        console.log(".gst reports ", data)
        if (response.ok) {
            SetGstReports(data)
        }


    }
        , [get, response]);



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


    function onSubmit(values) {
        console.log("Search/filter values:", values);
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
                title: "Supplier Name",
                name: "customerName",
                type: "text",
                inpprops: {},
            },
        ],
    };


    // Load Customers
    const loadCustomers = useCallback(async () => {
        const data = await get(api + "/customer/getall");
        console.log(".customer ", data)
        if (response.ok) setCustomers(data.map(s => ({ value: s.customerId, label: s.customerName })));
    }, [get, response]);



    useEffect(() => {
        loadCustomers();

    }, [loadCustomers]);





  const handleExcel = async (rowData) => {
    try {
      // const res = await get(api + `/invoiceHeader/print/${rowData.invoiceHeader?.invoiceHeaderId||rowData.invoiceHeaderId}`);
      const result = await get(api + "/invoiceHeader/download/excel/combinedGstReport");

      if (response.ok) {

        const blob = await response.blob();
        saveAs(blob, "combinedGstReport.xlsx");
      } else {
        AlertHandler("Failed to download file", "danger");
        console.log("fail to docnlods", response)
      }
    } catch (err) {
      console.log("errors,", err);
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
                // template={filterTemplate}
                rowwise={3}
                rows={10}
                onSubmit={onSubmit}
                buttonName="Search"
                validate={validate}
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
                // template={filterTemplate}
                rowwise={3}
                rows={10}
                onSubmit={onSubmit}
                buttonName="Search"
                validate={validate}
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
                rowwise={3}
                rows={3}
                onSubmit={onSubmit}
                buttonName="Search"
                validate={validate}
            />

        </div>
    );
};

export default ManageGstReports;
