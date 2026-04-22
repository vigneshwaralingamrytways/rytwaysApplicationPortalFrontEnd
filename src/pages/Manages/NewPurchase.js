import React, { useState, useEffect, useCallback, useRef } from "react";

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
import PurchaseItemTable from "./PurchaseItemTable";

const NewPurchase = ({
  selectedItem,
  onCancel,
  savePurchase,
  template,
  isCopy,
  serviceType,
  suppliers,
  supplierFullData,
  validate,
}) => {
  const prevSupplierIdRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  const supplierFullDataRef = useRef(supplierFullData);
  const headerIdRef = useRef(
    isCopy ? null : selectedItem?.invoiceHeaderId || selectedItem?.invoiceHeader?.invoiceHeaderId || null
  );
  const [headerId, setHeaderId] = useState(headerIdRef.current);
  const [editingItem, setEditingItem] = useState({});
  const [itemFormData, setItemFormData] = useState([]);
  const [paymentFormData, setPaymentFormData] = useState({});

  useEffect(() => {
    supplierFullDataRef.current = supplierFullData;
  }, [supplierFullData]);
  const headerFormRef = useRef({
    ...selectedItem,
    invoiceDate: selectedItem?.invoiceDate || today,
    supplierId: selectedItem?.supplierId || "",
    termOfDelivery: selectedItem?.termOfDelivery || "",
    gstNo: selectedItem?.gstNo || "",
    address: selectedItem?.address || "",
    state: selectedItem?.state || "",
  });

  const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
    state.alertProps.showAlert,
    state.alertProps.alertMessage,
    state.alertProps.alertVariant,
  ]);

  const AlertHandler = (msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: msg,
        alertVariant: type,
      })
    );
  };

  const { get, post, del, put, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const setHeaderIdSync = (id) => {
    headerIdRef.current = id;
    setHeaderId(id);
  };

  const templateForHeader = {
    fields: [
      {
        title: "Invoice No",
        type: "text",
        name: "invoiceNo",
        contains: "text",
        inpprops: {},
        validationProps: "Invoice number is required",
      },
      {
        title: "Invoice Date",
        type: "date",
        name: "invoiceDate",
        contains: "date",
        inpprops: {},
        validationProps: "Invoice date is required",
      },
      {
        title: "Supplier",
        type: "select",
        name: "supplierId",
        contains: "select",
        options: suppliers,
        validationProps: "Supplier is required",
      },
      {
        title: "GST No",
        type: "disabled",
        name: "gstNo",
        contains: "text",
        inpprops: { readOnly: true },
      },
      {
        title: "Address",
        type: "disabled",
        name: "address",
        contains: "text",
        inpprops: { readOnly: true },
      },
      {
        title: "State",
        type: "disabled",
        name: "state",
        contains: "text",
        inpprops: { readOnly: true },
      },
      {
        inpprops: {},
        title: "Term of Delivery",
        type: "text",
        name: "termOfDelivery",
        contains: "text",
      },
    ],
  };

  const templateForDetails = {
    fields: [
      {
        title: "Item Description",
        type: "text",
        name: "itemDescription",
        contains: "text",
        colMdSize: 12,
        inpprops: { rows: 1 },
        validationProps: "Description is required",
      },
      {
        title: "Amount",
        type: "number",
        name: "amount",
        contains: "number",
        validationProps: "Amount is required",
        inpprops: { md: 15 },
      },
      {
        title: "Tax (%)",
        type: "select",
        name: "tax",
        contains: "select",
        options: [
          { value: 18, label: "18%" },
          { value: 0, label: "0%" },
          { value: 5, label: "5%" },
          { value: 12, label: "12%" },
          { value: 20, label: "20%" },
        ],
        inpprops: { md: 15 },
      },
      {
        title: "Service Type",
        type: "select",
        name: "serviceTypeId",
        contains: "select",
        options: serviceType,
      },
    ],
  };

  const templateForPayment = {
    fields: [
      {
        title: "Gross Amount",
        type: "disabled",
        name: "grossAmount",
        contains: "number",
        validationProps: "Gross Amount is required",
        inpprops: { readOnly: true },
      },
      {
        title: "CGST",
        type: "disabled",
        name: "cgst",
        contains: "number",
        validationProps: "CGST is required",
        inpprops: { readOnly: true },
      },
      {
        title: "SGST",
        type: "disabled",
        name: "sgst",
        contains: "number",
        validationProps: "SGST is required",
        inpprops: { readOnly: true },
      },
      {
        inpprops: {},
        title: "IGST",
        type: "disabled",
        name: "igst",
        contains: "number",
        validationProps: "IGST is required",
      },
      {
        inpprops: {},
        title: "Total GST",
        type: "disabled",
        name: "totalGst",
        contains: "number",
        validationProps: "Total GST is required",
      },
      {
        inpprops: {},
        title: "Net Total",
        type: "disabled",
        name: "netTotal",
        contains: "number",
        validationProps: "Net Total is required",
      },
      {
        inpprops: {},
        title: "Advance",
        type: "disabled",
        name: "advance",
        contains: "number",
        validationProps: "Advance is required",
      },
      {
        inpprops: {},
        title: "Balance",
        type: "disabled",
        name: "balanceAmount",
        contains: "number",
        validationProps: "Balance is required",
      },
    ],
  };

  const loadInvoiceDetails = useCallback(
    async (targetHeaderId) => {
      if (!targetHeaderId) return;
      try {
        const data = await get(api + "/invoiceDetails/getAll?t=" + Date.now());
        if (data && Array.isArray(data)) {
          const filtered = data.filter(
            (item) => Number(item.invoiceHeaderId) === Number(targetHeaderId)
          );
          setItemFormData(filtered);
        }
      } catch (error) {
        console.log("Error loading invoice details:", error);
      }
    },
    [get]
  );

  const loadPaymentSummary = useCallback(
    async (hid) => {
      const targetId = hid || headerIdRef.current;
      if (!targetId) return;
      const data = await get(`${api}/paymentDetails/summary/${targetId}?t=${Date.now()}`);
      if (data) {
        setPaymentFormData(data);
      }
    },
    [get]
  );
useEffect(() => {
  if (selectedItem) {
    const initialSupplierId = selectedItem.supplierId || "";
     
    let supplierInfo = {};
    if (initialSupplierId && supplierFullData?.length) {
      const found = supplierFullData.find(
        (s) => String(s.supplierId) === String(initialSupplierId)
      );
      if (found) {
        supplierInfo = {
          gstNo: found.gstNo || "",
          address: found.address || "",
          state: found.state?.stateName || "",
        };
      }
    }

    headerFormRef.current = {
      invoiceNo: selectedItem.invoiceNo || "",
      invoiceDate: selectedItem.invoiceDate || today,
      supplierId: initialSupplierId,
      termOfDelivery: selectedItem.termOfDelivery || "",
      invoiceHeaderId: selectedItem.invoiceHeaderId || null,
      statusId: selectedItem.statusId || null,
      ...supplierInfo,   
    };
    prevSupplierIdRef.current = initialSupplierId;
  }
}, [selectedItem]);
  useEffect(() => {
    const id =
      selectedItem?.invoiceHeaderId ||
      selectedItem?.invoiceHeader?.invoiceHeaderId ||
      null;
    if (id) {
      loadInvoiceDetails(id);
      loadPaymentSummary(id);
    }
  }, []);

  const handleDelete = async (id) => {
    const res = await del(api + "/invoiceDetails/delete/" + id);
    if (response.ok) {
      setItemFormData((prev) =>
        prev.filter((item) => item.invoiceDetailsId !== id)
      );
      await loadPaymentSummary();
      AlertHandler("Item deleted", "success");
    } else {
      AlertHandler("Failed to delete item", "danger");
    }
  };

  const showFormHandler = (rowData, action) => () => {
    if (action === "Edit") {
      setEditingItem(rowData);
    }
    if (action === "Delete") {
      handleDelete(rowData.invoiceDetailsId);
    }
  };

  const saveHeader = async () => {
    try {
      const values = headerFormRef.current;
      const val = {
        invoiceHeaderId: values.invoiceHeaderId,
        invoiceNo: values.invoiceNo,
        invoiceDate: values.invoiceDate,
        supplierId: values.supplierId,
        termOfDelivery: values.termOfDelivery,
        typeOfInvoiceHeader: "PURCHASE",
        statusId: values.statusId,
      };

      let res;
      if (headerIdRef.current) {
        res = await put(api + "/invoiceHeader/update/" + headerIdRef.current, val);
      } else {
        res = await post(api + "/invoiceHeader/create?t=" + Date.now(), val);
      }

      if (res) {
        setHeaderIdSync(res.invoiceHeaderId);
        headerFormRef.current.invoiceHeaderId = res.invoiceHeaderId;
        return res.invoiceHeaderId;
      } else {
        AlertHandler("Failed to save Invoice Header", "danger");
        return null;
      }
    } catch (err) {
      console.log(err);
      AlertHandler("Header error", "danger");
      return null;
    }
  };

  const handleAddItem = async (itemData) => {
    try {
      let currentHeaderId = headerIdRef.current;

      if (!currentHeaderId) {
        if (!headerFormRef.current?.invoiceNo || !headerFormRef.current?.supplierId) {
          AlertHandler("Please fill Invoice Header before adding items", "danger");
          return;
        }
        const hid = await saveHeader();
        if (!hid) return;
        currentHeaderId = hid;
      }

      const val = {
        ...itemData,
        quantity: 1,
        invoiceHeaderId: currentHeaderId,
        invoiceNo: headerFormRef.current?.invoiceNo || selectedItem?.invoiceNo,
        supplierId: headerFormRef.current?.supplierId || selectedItem?.supplierId,
        invoiceDate: headerFormRef.current?.invoiceDate || selectedItem?.invoiceDate,
        typeOfInvoiceDetails: "PURCHASE",
      };

      if (editingItem?.invoiceDetailsId && !isCopy) {
        const resUpdate = await put(
          api + "/invoiceDetails/update/" + itemData.invoiceDetailsId,
          val
        );
        if (resUpdate && resUpdate.invoiceDetailsId) {
          setItemFormData((prev) =>
            prev.map((item) =>
              item.invoiceDetailsId === editingItem.invoiceDetailsId
                ? { ...item, ...resUpdate }
                : item
            )
          );
          await loadPaymentSummary(currentHeaderId);
          setEditingItem({});
        } else {
          AlertHandler("Item not updated", "danger");
        }
      } else {
        const res = await post(api + "/invoiceDetails/create", val);
        if (res && res.invoiceDetailsId) {
          setItemFormData((prev) => [...prev, res]);
          await loadPaymentSummary(currentHeaderId);
          setEditingItem({});
        } else {
          AlertHandler("Item not added", "danger");
        }
      }
    } catch (e) {
      console.log(e);
      AlertHandler("Error adding item", "danger");
    }
  };

  const handleSavePayment = async (paymentData) => {
    if (!headerIdRef.current) {
      AlertHandler("Please add Invoice Header before saving payment", "danger");
      return;
    }
    if (itemFormData.length === 0) {
      AlertHandler("Please add Invoice Items before saving payment", "danger");
      return;
    }

    try {
      const updatedHeaderId = await saveHeader();
      await loadPaymentSummary();

      if (updatedHeaderId) {
        const val = {
          ...paymentData,
          ...paymentFormData,
          invoiceHeaderId: headerIdRef.current,
          invoiceNo: headerFormRef.current.invoiceNo,
          supplierId: headerFormRef.current.supplierId,
          typeofPaymentDetails: "PURCHASE",
        };

        const res = await post(`${api}/paymentDetails/create/${headerIdRef.current}`, val);

        if (response.ok) {
          AlertHandler("Purchase saved successfully", "success");
          onCancel();
        } else {
          AlertHandler("Payment save failed", "danger");
        }
      }
    } catch (err) {
      console.log("Save Error:", err);
      AlertHandler("Something went wrong during save", "danger");
    }
  };

  const actions = ["Edit", "Delete", "Add"];

  function onSubmit(values) {
    console.log("Search/filter values:", values);
  }

  const headerWatchFields = [
    "invoiceNo",
    "invoiceDate",
    "supplierId",
    "poNo",
    "poDate",
    "termOfDelivery",
  ];

  const syncHeaderData = useCallback(
    async (watchedValues, { setValue }) => {
      if (!watchedValues) return;

      const [invoiceNo, invoiceDate, supplierId, poNo, poDate, termOfDelivery] = watchedValues;

      headerFormRef.current = {
        ...headerFormRef.current,
        invoiceNo,
        invoiceDate,
        supplierId,
        termOfDelivery,
      };

      if (supplierId) {
        const found = supplierFullDataRef.current?.find(
          (s) => String(s.supplierId) === String(supplierId)
        );
        if (found) {
          setValue("gstNo", found.gstNo || "");
          setValue("address", found.address || "");
          setValue("state", found.state?.stateName || "");

          headerFormRef.current = {
            ...headerFormRef.current,
            gstNo: found.gstNo || "",
            address: found.address || "",
            state: found.state?.stateName || "",
          };

          const prevSupplierId = prevSupplierIdRef.current;
          if (
            headerIdRef.current &&
            String(supplierId) !== String(prevSupplierId)
          ) {
            prevSupplierIdRef.current = supplierId;
            await saveHeader();
            await loadPaymentSummary(headerIdRef.current);
          }
          prevSupplierIdRef.current = supplierId;
        }
      }
    },
    []
  );
  return (
    <Popupcard title="Add Purchase Invoice" showBack onBack={onCancel}>
      <CreateForm
        template={templateForHeader}
        rowwise={4}
        defaultValues={{
          ...headerFormRef.current,
          invoiceDate: headerFormRef.current.invoiceDate || today,
          gstNo: headerFormRef.current.gstNo || "",
          address: headerFormRef.current.address || "",
          state: headerFormRef.current.state || "",
          supplierId: headerFormRef.current.supplierId || "",
        }}
        validate={syncHeaderData}
        watchFields={headerWatchFields}
      />

      <CreateForm
        template={templateForDetails}
        rowwise={4}
        defaultValues={editingItem}
        onSubmit={handleAddItem}
        onCancel={() => setEditingItem({})}
        buttonName={editingItem?.invoiceDetailsId ? "Update" : "Add"}
        validate={validate}
      />

      <NewTable
        cols={PurchaseItemTable(showFormHandler, actions, serviceType)}
        data={itemFormData}
        defaultValues={selectedItem}
        striped
        title="Purchase items"
        handleAddClick={showFormHandler({}, "Add")}
        rowwise={4}
        rows={10}
        actions={actions}
        onSubmit={onSubmit}
        showFilterIcon={false}
        validate={validate}
      />

      <CreateForm
        template={templateForPayment}
        rowwise={4}
        defaultValues={paymentFormData}
        onSubmit={handleSavePayment}
        onCancel={onCancel}
        buttonName="Save"
        validate={validate}
      />
    </Popupcard>
  );
};

export default NewPurchase;