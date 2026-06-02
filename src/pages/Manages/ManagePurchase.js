import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  api,
  useFetch,
  alertActions,
  modalActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";
import Upload from "./Upload";
import ManagePurchaseTable from "./ManagePurchaseTable";
import NewPurchase from "./NewPurchase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ManagePurchase = (props) => {
  const { isReconsile } = props;

  const { get, del, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [allPurchases, setAllPurchases] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [supplierFullData, setSupplierFullData] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [serviceType, setServiceType] = useState([]);
  const [openRow, setOpenRow] = useState(null);
  const [selectedSales, setSelectedSales] = useState([]);

  // ? SLIDE STATES
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

  // ============================
  // ALERT HANDLER
  // ============================

  const AlertHandler = (msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: msg,
        alertVariant: type,
      })
    );
  };

  // ============================
  // ? FIX VALIDATE FUNCTION
  // ============================

  const validate = useCallback(() => {
    return true;
  }, []);

  // ============================
  // ? SLIDE CLOSE FUNCTION
  // ============================

  const closeSlide = () => {
    setIsSlideOpen(false);
    setActiveForm(null);
    loadPurchases();
  };

  // ============================
  // LOAD SUPPLIERS
  // ============================

  const loadSuppliers = useCallback(async () => {
    const data = await get(api + "/supplier/getall?t=" + Date.now());
    if (response.ok) {
      setSupplierFullData(data)
      setSuppliers(
        data.map((s) => ({
          value: s.supplierId,
          label: s.supplierName,
        }))
      );
    }
  }, [get, response]);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  // ============================
  // LOAD SERVICE TYPE
  // ============================

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

  // ============================
  // LOAD PURCHASES
  // ============================

  const loadPurchases = useCallback(async () => {
    // const data = await get(api + "/invoiceHeader/getAll/PURCHASE");
    const data = await get(api + "/invoiceHeader/getAll/PURCHASE?t=" + Date.now());
    console.log("load data for all purchases", data)
    if (response.ok) {
      setPurchases(data);
      setAllPurchases(data);
    }
  }, [get, response]);

  useEffect(() => {
    loadPurchases();
  }, [loadPurchases]);

  // ============================
  // DELETE PURCHASE
  // ============================

  const deletePurchase = async (id) => {
    const res = await del(api + "/invoiceHeader/delete/" + id + "?t=" + Date.now());

    if (res) {
      AlertHandler("Purchase deleted", "success");
      // setPurchases((prev) =>
      //   prev.filter((item) => item.invoiceHeaderId !== id)
      // );
      await loadPurchases();
    } else {
      AlertHandler("Failed to delete purchase", "danger");
    }
  };

  const handleExcel = async () => {
    try {
      setSheets([]);
      setActiveSheet(0);
      setIsExcelPreview(true);
      setPreviewRowData({ invoiceHeader: { invoiceNo: "Purchase GST Report" } });
      setPreviewPopup(true);
      setPreviewBlobUrl(null);
      const result = await get(api + "/invoiceHeader/download/excel/purchase");

      // if (response.ok) {
      //   const blob = await response.blob();
      //   saveAs(blob, "PurchaseGSTReport.xlsx");
      // } 
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
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
      }
    } catch (err) {
      setPreviewPopup(false);
      AlertHandler("Error downloading file", "danger");
    }
  };

  const handleDownload = async (rowData) => {
    try {
      const res = await get(api + `/invoiceHeader/printPurchaseOrder/${rowData.invoiceHeader?.invoiceHeaderId || rowData.invoiceHeaderId}`);
      // if (response.ok) {

      //   const blob = await response.blob();
      //   saveAs(blob, `${rowData.invoiceNo}.pdf`);
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
      saveAs(blobUrlRef.current, isExcelPreview ? "PurchaseGSTReport.xlsx" : "Invoice.pdf");
    } else if (previewRowData) {
      handleDownload(previewRowData);
    }
  };
  const handlePrintPreview = async (rowData) => {
    setIsExcelPreview(false);
    try {
      const id = rowData.invoiceHeader?.invoiceHeaderId || rowData.invoiceHeaderId;
      setPreviewRowData(rowData);
      setPreviewPopup(true);
      setPreviewBlobUrl(null);
      const res = await get(api + `/invoiceHeader/printPurchaseOrder/${id}`);
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


  const actions = ["Edit", "Add", "Upload", "Delete", "print"];



  const showFormHandler = (purchase, action) => () => {
    const isEdit = action === "Edit";

    // ? SLIDE FOR ADD + EDIT ONLY
    if (action === "Add" || isEdit) {
      let data = {};

      if (isEdit && purchase.invoiceHeader) {
        data = {
          ...purchase.invoiceHeader,
          invoiceDetails:
            purchase.invoiceDetails ||
            purchase.invoiceHeader.invoiceDetails ||
            [],
        };
      } else {
        data = { ...purchase };
      }

      // ? OPEN SLIDE
      setActiveForm(
        <NewPurchase
          selectedItem={data}
          serviceType={serviceType}
          suppliers={suppliers}
          supplierFullData={supplierFullData}
          validate={validate}
          actions={actions}
          showFormHandler={showFormHandler}
          onCancel={closeSlide}
        />
      );

      setIsSlideOpen(true);
      return;
    }

    // PRINT
    if (action === "print") {
      handlePrintPreview(purchase);
    }

    // DELETE
    if (action === "Delete") {
      deletePurchase(
        purchase.invoiceHeaderId || purchase.invoiceHeader?.invoiceHeaderId
      );
    }

    // UPLOAD (still modal)
    if (action === "Upload") {
      setActiveForm(
        <Upload
          referenceId={
            purchase.invoiceHeaderId ||
            purchase.invoiceHeader?.invoiceHeaderId
          }
          referenceType="PURCHASE"
          uploadTitle="Purchase Invoice Upload"
          financialYear={purchase.invoiceHeader?.invoiceDate}
          onCancel={closeSlide}
          validate={validate}
        />
      );

      setIsSlideOpen(true);
      return;
    }
  };

  // ============================
  // SEARCH FILTER
  // ============================

  function onSubmit(values) {
    const { fromDate, toDate, supplierId } = values;

    if (!fromDate && !toDate && !supplierId) {
      setPurchases(allPurchases);
      return;
    }

    const filtered = allPurchases.filter((item) => {
      const header = item.invoiceHeader || {};
      const itemSupplierId =
        header.supplierId || header.supplier?.supplierId;

      const supplierMatch = supplierId
        ? String(itemSupplierId) === String(supplierId)
        : true;

      let dateMatch = true;

      if (header.invoiceDate) {
        const itemDate = new Date(header.invoiceDate).setHours(0, 0, 0, 0);
        const from = fromDate
          ? new Date(fromDate).setHours(0, 0, 0, 0)
          : null;
        const to = toDate
          ? new Date(toDate).setHours(0, 0, 0, 0)
          : null;

        dateMatch =
          (!from || itemDate >= from) && (!to || itemDate <= to);
      }

      return supplierMatch && dateMatch;
    });

    setPurchases(filtered);
  }

  // ============================
  // FILTER TEMPLATE
  // ============================

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
        title: "Supplier Name",
        type: "select",
        name: "supplierId",
        options: suppliers,
      },
    ],
  };

  // ============================
  // CHECKBOX EVENT
  // ============================

  const onCheckBoxEvent = (item, checked) => {
    if (checked) {
      setSelectedSales((prev) => [...prev, item]);
    } else {
      setSelectedSales((prev) =>
        prev.filter(
          (s) =>
            (s.invoiceHeader?.invoiceHeaderId || s.invoiceHeaderId) !==
            (item.invoiceHeader?.invoiceHeaderId || item.invoiceHeaderId)
        )
      );
    }
  };

  // ============================
  // RETURN UI
  // ============================
  return (
    <div className={classes.container} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div style={{ transition: "0.4s ease", opacity: isSlideOpen ? 0 : 1, pointerEvents: isSlideOpen ? "none" : "auto" }}>
        <NewTable
          cols={ManagePurchaseTable(showFormHandler, actions, false, isReconsile, openRow, setOpenRow)}
          data={purchases}
          striped
          title="Manage Purchase"
          showPlusCircle={!isReconsile}
          showExcelIcon={!isReconsile}
          hideSNo={isReconsile}
          handleAddClick={showFormHandler({}, "Add")}
          template={filterTemplate}
          rowwise={3}
          rows={10}
          onSubmit={onSubmit}
          buttonName="Search"
          validate={validate}
          handleExcelIcon={handleExcel}
        />
      </div>

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
                {isExcelPreview ? "Excel Preview: Purchase GST Report" : `Invoice Print Preview: ${previewRowData?.invoiceHeader?.invoiceNo}`}
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
                    className="purchase-excel-preview-table"
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
            .purchase-excel-preview-table table { border-collapse: collapse; font-size: 13px; width: 100%; }
            .purchase-excel-preview-table td, .purchase-excel-preview-table th { border: 1px solid #ddd; padding: 6px 10px; white-space: nowrap; text-align: left; }
            .purchase-excel-preview-table th { background-color: #f9fafb; font-weight: bold; }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default ManagePurchase;