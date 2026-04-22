import React, { useCallback, useEffect, useState } from "react";
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
    const res=await del(api + "/invoiceHeader/delete/" + id + "?t=" + Date.now());

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
      const result = await get(api + "/invoiceHeader/download/excel/purchase");

      if (response.ok) {
        const blob = await response.blob();
        saveAs(blob, "PurchaseGSTReport.xlsx");
      } else {
        AlertHandler("Failed to download file", "danger");
      }
    } catch (err) {
      AlertHandler("Error downloading file", "danger");
    }
  };

  const handleDownload = async (rowData) => {
    try {
      const res = await get(api + `/invoiceHeader/printPurchaseOrder/${rowData.invoiceHeader?.invoiceHeaderId || rowData.invoiceHeaderId}`);
      if (response.ok) {

        const blob = await response.blob();
        saveAs(blob, `${rowData.invoiceNo}.pdf`);
      } else {
        AlertHandler("Failed to download file", "danger");
        console.log("fail to docnlods", response)
      }
    } catch (err) {
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
      handleDownload(purchase);
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

      <div style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "100%",
        height: "100%",
        transform: isSlideOpen ? "translateX(0%)" : "translateX(100%)",
        transition: "0.4s ease-in-out",
        zIndex: 999,
        background: "#fff",
        overflowY: "auto"
      }}>
        {activeForm}
      </div>
    </div>
  );
};

export default ManagePurchase;