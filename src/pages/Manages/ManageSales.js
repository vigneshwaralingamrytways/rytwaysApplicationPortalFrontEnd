import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";
import Upload from "./Upload";
import ManageSalesTable from "./ManageSalesTable";
import NewSales from "./NewSales";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
const ManageSales = (props) => {
  const { isReconsile } = props;
  const { get, post, del, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [selectedSales, setSelectedSales] = useState([]);
  const [Saless, setSaless] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [Customers, setCustomers] = useState([]);
  const [AllCustomers, setAllCustomers] = useState([]);

  const [serviceType, setServiceType] = useState([]);

  /* ? Slide State */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(0);
  const [isExcelPreview, setIsExcelPreview] = useState(false);
  const blobUrlRef = useRef(null);

  const [previewPopup, setPreviewPopup] = useState(false);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [previewRowData, setPreviewRowData] = useState(null);

  const [showAlert] = useSelector((state) => [
    state.alertProps.showAlert,
  ]);

  // ? FIXED: Clear form on mount
  useEffect(() => {
    setActiveForm(null);
  }, []);

  /* ---------------- Alert Handler ---------------- */
  const AlertHandler = (msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: true,  // ? FIXED: Always true
        alertMessage: msg,
        alertVariant: type,
      })
    );
  };

  /* ---------------- Load Customers ---------------- */
  const loadCustomers = useCallback(async () => {
    const data = await get(api + "/customer/getall");

    if (response.ok) {
      setAllCustomers(data)
      setCustomers([
        { value: "", label: "Select" },
        ...data.map((s) => ({
          value: s.customerId,
          label: s.customerName,
        })),
      ]);
    }
  }, [get, response]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  /* ---------------- Load Service Type ---------------- */
  const loadServiceType = useCallback(async () => {
    const data = await get(api + "/serviceType/getAllServiceType?t=" + Date.now());

    if (response.ok) {
      setServiceType([
        { value: "", label: "Select" },
        ...data.map((s) => ({
          value: s.serviceTypeId,
          label: s.serviceTypeName,
        })),
      ]);
    }
  }, [get, response]);

  useEffect(() => {
    loadServiceType();
  }, [loadServiceType]);

  /* ---------------- Load Sales ---------------- */
  const loadSaless = useCallback(async () => {
    // const data = await get(api + "/invoiceHeader/getAll/SALES");
    const data = await get(`${api}/invoiceHeader/getAll/SALES?t=${Date.now()}`);
    console.log("all sales data")
    console.table(data)
    if (response.ok) {
      setSaless(data);
      setAllSales(data);
    }
  }, [get, response]);

  useEffect(() => {
    loadSaless();
  }, [loadSaless]);

  /* ---------------- Delete Sales ---------------- */
  const deleteSales = async (id) => {
    const res = await del(api + "/invoiceHeader/delete/" + id);

    if (response.ok) {

      // setSaless((prev) =>
      //   prev.filter((item) => item.invoiceHeaderId !== id)
      // );
      await loadSaless()
      AlertHandler("Sales deleted", "success");

    } else {
      // const errorText = res?.trace || res?.message || "";


      AlertHandler("Failed to delete Sales", "danger");

    }
  };

  const actions = ["Edit", "print", "Upload", "Delete", "Copy"];

  const validate = () => true;

  /* ---------------- Excel Download ---------------- */
  const handleExcel = async (rowData) => {
    try {
      setSheets([]);
      setActiveSheet(0);
      setIsExcelPreview(true);
      setPreviewRowData({ invoiceHeader: { invoiceNo: "Sales GST Report" } });
      setPreviewPopup(true);
      setPreviewBlobUrl(null);
      const result = await get(api + "/invoiceHeader/download/excel");

      // if (response.ok) {
      //   const blob = await response.blob();
      //   saveAs(blob, "Sales_GST_Report.xlsx");
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

  const handleDownload = async (rowData) => {
    try {
      const res = await get(api + `/invoiceHeader/print/${rowData.invoiceHeader?.invoiceHeaderId || rowData.invoiceHeaderId}`);
      // if (response.ok) {
      //   const blob = await response.blob();
      //   saveAs(blob, `${rowData.invoiceHeader?.invoiceNo + "_" + rowData.invoiceHeader?.customer?.customerName}.pdf`);
      // }
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${rowData.invoiceHeader?.invoiceNo || 'Invoice'}_${rowData.invoiceHeader?.customer?.customerName || 'Customer'}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
      else {
        AlertHandler("Failed to download file", "danger");
        console.log("fail to docnlods", response)
      }
    } catch (err) {
      console.log("errors,", err);
    }
  };

  const closePreviewPopup = () => {
    setPreviewPopup(false);
    setIsExcelPreview(false);
    setSheets([]);
    setActiveSheet(0);
    if (blobUrlRef.current) {
      window.URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setPreviewBlobUrl(null);
    setPreviewRowData(null);
  };

  const handleDownloadFallback = () => {
    if (blobUrlRef.current) {
      saveAs(blobUrlRef.current, isExcelPreview ? "Sales_GST_Report.xlsx" : "Invoice.pdf");
    } else if (previewRowData) {
      handleDownload(previewRowData);
    }
  };
  const handlePrintPreview = async (rowData) => {
    try {

      setIsExcelPreview(false);
      const id = rowData.invoiceHeader?.invoiceHeaderId || rowData.invoiceHeaderId;
      setPreviewRowData(rowData);
      setPreviewPopup(true);
      setPreviewBlobUrl(null);
      const res = await get(api + `/invoiceHeader/print/${id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setPreviewBlobUrl(url);
      } else {
        setPreviewPopup(false);
        AlertHandler("Failed to load preview", "danger");
      }
    } catch (err) {
      setPreviewPopup(false);
      console.log("errors,", err);
    }
  };

  
  /* ---------------- Copy Invoice ---------------- */
  const copyInvoiceDirectly = async (row) => {
    try {
      const headerId =
        row.invoiceHeader?.invoiceHeaderId || row.invoiceHeaderId;

      await post(api + "/invoiceHeader/copy/" + headerId);

      if (response.ok) {
        AlertHandler("Invoice copied successfully", "success");
        loadSaless();
      } else {
        AlertHandler("Copy failed", "danger");
      }
    } catch (err) {
      AlertHandler("Copy failed", "danger");
    }
  };

  /* ---------------- FIXED Slide Form Handler ---------------- */
  const showFormHandler = (Sales, action) => async () => {
    const isEdit = action === "Edit";

    if (action === "Copy") {
      await copyInvoiceDirectly(Sales);
      return;
    }

    /* ? Add / Edit Slide */
    if (action === "Add" || isEdit) {
      let data = {};

      if (isEdit && Sales.invoiceHeader) {
        data = {
          ...Sales.invoiceHeader,
          invoiceDetails:
            Sales.invoiceDetails ||
            Sales.invoiceHeader.invoiceDetails ||
            [],
        };
      } else {
        data = { invoiceDetails: [] };
      }

      setActiveForm(
        <NewSales
          isEdit={isEdit}
          key={`sales-form-${Date.now()}`}
          selectedItem={data}
          serviceType={serviceType}
          Customers={Customers}
          AllCustomers={AllCustomers}
          onCancel={() => {
            setIsSlideOpen(false);
            setActiveForm(null);
            loadSaless();
          }}
          validate={validate}
          actions={actions}
          showFormHandler={showFormHandler}
        />
      );

      setIsSlideOpen(true);
    }

    /* ? Upload Slide */
    if (action === "Upload") {
      setActiveForm(
        <Upload
          key={`upload-form-${Date.now()}`}  // ? FIXED: Unique key
          referenceId={
            Sales.invoiceHeader?.invoiceHeaderId ||
            Sales.invoiceHeaderId
          }
          referenceType="SALES"
          uploadTitle="Sales Invoice Upload"
          financialYear={Sales.invoiceHeader?.invoiceDate}
          onCancel={() => {
            setIsSlideOpen(false);
            setActiveForm(null);
            loadSaless();
          }}
          validate={validate}
        />
      );

      setIsSlideOpen(true);
    }

    /* Delete */
    if (action === "Delete") {
      deleteSales(Sales.invoiceHeader?.invoiceHeaderId);
    }

    /* Print */
    if (action === "print") {
      handlePrintPreview(Sales);
    }
  };

  /* ---------------- Search Filter ---------------- */
  const onSubmit = (values) => {
    const { fromDate, toDate, customerId } = values;

    if (!fromDate && !toDate && !customerId) {
      setSaless(allSales);
      return;
    }

    const filtered = allSales.filter((item) => {
      const header = item.invoiceHeader ? item.invoiceHeader : item;

      const itemCustomerId =
        header.customerId || header.customer?.customerId;

      const customerMatch = customerId
        ? String(itemCustomerId) === String(customerId)
        : true;

      let dateMatch = true;
      if (header.invoiceDate) {
        const itemDate = new Date(header.invoiceDate).setHours(
          0,
          0,
          0,
          0
        );
        const from = fromDate
          ? new Date(fromDate).setHours(0, 0, 0, 0)
          : null;
        const to = toDate
          ? new Date(toDate).setHours(0, 0, 0, 0)
          : null;

        dateMatch =
          (!from || itemDate >= from) && (!to || itemDate <= to);
      }

      return customerMatch && dateMatch;
    });

    setSaless(filtered);
  };

  const filterTemplate = {
    fields: [
      {
        title: "From Date",
        name: "fromDate",
        type: "date",
      },
      {
        title: "To Date",
        name: "toDate",
        type: "date",
      },
      {
        title: "Customer Name",
        type: "select",
        name: "customerId",
        options: Customers,
      },
    ],
  };

  return (
    <div
      className={classes.container}
      style={{
        position: "relative",
        width: "100%",
        height: '100%'
      }}
    >
      {/* ? Table */}
      <div
        style={{
          transition: "0.4s ease",
          opacity: isSlideOpen ? 0 : 1,
          pointerEvents: isSlideOpen ? "none" : "auto",
        }}
      >
        <NewTable
          cols={ManageSalesTable(showFormHandler, actions, false, isReconsile)}
          data={Saless}
          striped
          title="Manage Sales"
          showPlusCircle={!isReconsile}
          showExcelIcon={!isReconsile}
          hideSNo={isReconsile}
          handleExcelIcon={handleExcel}
          handleAddClick={showFormHandler({}, "Add")}
          template={filterTemplate}
          rowwise={3}
          rows={25}
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
          transform: isSlideOpen ? "translateX(0%)" : "translateX(100%)",
          transition: "0.4s ease-in-out",
          zIndex: 999,
          overflowY: "auto",
        }}
      >
        {activeForm}
      </div>

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
                {isExcelPreview ? "Excel Preview: Sales GST Report" : `Invoice Print Preview: ${previewRowData?.invoiceHeader?.invoiceNo}`}
              </span>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="btn btn-primary"
                  onClick={handleDownloadFallback}
                  style={{ padding: "6px 15px", fontSize: "13px" }}
                >
                  {isExcelPreview ? "Download Excel" : "Download PDF"}
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

            <div style={{ flex: 1, background: isExcelPreview ? "#fff" : "rgba(255,255,255,0.05)", borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {!previewBlobUrl ? (
                <div style={{ color: isExcelPreview ? "#333" : "rgba(255,255,255,0.5)", textAlign: "center", paddingTop: "20%", flex: 1 }}>
                  Loading Report Data Preview...
                </div>
              ) : isExcelPreview ? (
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
                    className="sales-excel-preview-table"
                    dangerouslySetInnerHTML={{ __html: sheets[activeSheet]?.html }}
                  />
                </div>
              ) : (
                <iframe
                  src={previewBlobUrl}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title="Invoice Preview"
                />
              )}
            </div>
          </div>
          <style>{`
            .sales-excel-preview-table table { border-collapse: collapse; font-size: 13px; width: 100%; }
            .sales-excel-preview-table td, .sales-excel-preview-table th { border: 1px solid #ddd; padding: 6px 10px; white-space: nowrap; text-align: left; }
            .sales-excel-preview-table th { background-color: #f9fafb; font-weight: bold; }
          `}</style>
        </div>
      )}

    </div>
  );
};

export default ManageSales;