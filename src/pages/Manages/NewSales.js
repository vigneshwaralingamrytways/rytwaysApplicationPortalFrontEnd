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

import SalesItemTable from "./SalesItemTable";
import { selectedIdsLookupSelector } from "@mui/x-data-grid";


const NewSales = ({ selectedItem,
  onCancel,
  saveSales,
  template,
  Customers,
  AllCustomers,
  isCopy,

  serviceType,
  validate,
  isEdit }) => {

  const [Salesitems, setSalesItems] = useState([]);
  const [initialItemCount, setInitialItemCount] = useState(0);
  const today = new Date().toISOString().split('T')[0];
  // const [headerId, setHeaderId] = useState(
  //   isCopy ? null : selectedItem?.invoiceHeaderId || null
  // );
  const headerIdRef = useRef(isCopy ? null : selectedItem?.invoiceHeaderId || null);
  const [headerId, setHeaderId] = useState(headerIdRef.current);

  const setHeaderIdSync = (id) => {
    headerIdRef.current = id;
    setHeaderId(id);
  };

  console.log(" seletceted item:", selectedItem)
  const initialLoadDone = useRef(false);
  const [editingItem, setEditingItem] = useState({});
  // const [Customers, setCustomers] = useState([]);

  // const [headerFormData, setHeaderFormData] = useState({});
  // const headerFormRef = useRef(selectedItem || {});
  const headerFormRef = useRef({
    ...selectedItem,
    invoiceDate: selectedItem?.invoiceDate || today,
    poDate: selectedItem?.poDate || "",
    gstNo: "",
    address: "",
    state: ""
  });

  // const headerFormRef = useRef(selectedItem?.invoiceDate ? selectedItem : { ...selectedItem, invoiceDate: today });
  const [itemFormData, setItemFormData] = useState([]);
  const [paymentFormData, setPaymentFormData] = useState({});
  const [showHeader, setShowHeader] = useState(true);
  // const [SelectedCustomerInfo, setSelectedCustomerInfo] = useState(null);


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

  const [SacCodes, setSacCodes] = useState([]);
  const [invoiceType, setInvoiceType] = useState([]);
  const { get, post, del, put, response } = useFetch({ data: [] });
  const dispatch = useDispatch();
  const loadSacCodes = useCallback(async () => {
    const data = await get(api + "/sacCode/getAll?t=" + Date.now());


    if (response.ok) {
      setSacCodes([
        { value: "", label: "Select" },
        ...data.map((s) => ({
          value: s.sacCodeId,
          label: s.sacCode,
        })),
      ]);
    }

  }, [get, response]);

  useEffect(() => {
    loadSacCodes();
  }, [loadSacCodes]);

  const loadInvoivceType = useCallback(async () => {
    const data = await get(api + "/invoiceType/getAllInvoiceType?t=" + Date.now());

    if (data && Array.isArray(data)) {
      setInvoiceType([
        { value: "", label: "Select" },
        ...data.map((s) => ({
          value: s.invoiceTypeId,
          label: s.invoiceTypeName,
        })),
      ]);
    }
  }, [get, response]);

  useEffect(() => {
    loadInvoivceType();
  }, [loadInvoivceType]);

  const templateForHeader = {

    fields: [
      ...(isEdit ? [{
        title: "Invoice No",
        type: "disabled",
        name: "invoiceNo",
        contains: "text",
        inpprops: {},
        // validationProps: "Invoice number is required",
      }] : []),

      {
        title: "Invoice Date",
        type: "date",
        name: "invoiceDate",
        contains: "date",
        inpprops: {},
        validationProps: "Invoice date is required",
      },
      {
        title: "Invoice Type",
        type: "select",
        name: "invoiceTypeName",
        contains: "text",
        inpprops: {},
        options: invoiceType,
        validationProps: "Invoice Type is required",
      },
      {
        title: "Customer",
        type: "select",
        name: "customerId",
        contains: "select",
        options: Customers,
        validationProps: "Customer is required",
      },
      {
        title: "GST No",
        type: "disabled",
        name: "gstNo",
        contains: "text",
        inpprops: {

          readOnly: true,
        },
      },
      {
        title: "Address",
        type: "disabled",
        name: "address",
        contains: "text",
        inpprops: {

          readOnly: true,
        },
      },
      {
        title: "State",
        type: "disabled",
        name: "state",
        contains: "text",
        inpprops: {

          readOnly: true,
        },
      },

      {
        title: "PO No",
        type: "text",
        name: "poNo",
        contains: "text",
        inpprops: {},
        validationProps: "PO number is required",
      },
      {
        inpprops: {},
        title: "PO Date",
        type: "date",
        name: "poDate",
        contains: "date",
        validationProps: "PO date is required",
      },
      {
        inpprops: {},
        title: "Term of Delivery",
        type: "text",
        name: "termOfDelivery",
        contains: "text",
        // validationProps: "Term of Delivery is required",
      },

    ]
  }



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
      // {
      //   title: "Quantity",
      //   type: "number",
      //   name: "quantity",
      //   contains: "number",
      //   inpprops: { md: 15, },
      //   validationProps: " Quantity is required",
      // },
      {
        title: "Amount",
        type: "number",
        name: "amount",
        contains: "number",
        //  inpprops: { md: 2 },
        validationProps: "Amount is required",
      },
      {
        // inpprops: { md: 2 },
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
      },
      {
        // inpprops: { md: 3 },
        title: "Service Type",
        type: "select",
        name: "serviceTypeId",
        contains: "select",
        options: serviceType,
      },
      // dynamic: { field: "requestType", value: "leave" },

      {
        // inpprops: { md: 3 },
        title: "Buying Price",
        type: "number",
        name: "buyingPrice",
        contains: "number",

        dynamic: { field: "serviceTypeId", value: "3" },
      },
      {
        // inpprops: { md: 3 },
        title: "Margin Amount",
        type: "disabled",
        name: "marginAmount",
        contains: "number",

        dynamic: { field: "serviceTypeId", value: "3" },
      },
      {
        //  inpprops: { md: 3 },
        title: "SAC Code",
        type: "select",
        name: "sacCodeId",
        options: SacCodes,
        contains: "number",
        validationProps: "SAC Code is required",
      },
      // {
      //   //  inpprops: { md: 2 },
      //   title: "net total",
      //   type: "number",
      //   name: "netTotal",
      //   contains: "number",
      //   validationProps: "net total Code is required",
      // },
    ]
  }






  // }
  const templateForPayment = {
    fields: [{
      inpprops: {},
      title: "Gross Amount",
      type: "disabled",
      name: "grossAmount",
      contains: "number",
      validationProps: "Gross Amount is required",
    },

    {
      inpprops: {},
      title: "CGST",
      type: "disabled",
      name: "cgst",
      contains: "number",
      validationProps: "CGST is required",
    },

    {
      inpprops: {},
      title: "SGST",
      type: "disabled",
      name: "sgst",
      contains: "number",
      validationProps: "SGST is required",
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

      // {
      //   inpprops: {},
      //   title: "Remarks",
      //   type: "text",
      //   name: "remarks",
      //   contains: "text",
      // },


    ]
  }


  useEffect(() => {
    if (isCopy && selectedItem) {


      headerFormRef.current = {
        ...selectedItem,
        invoiceHeaderId: null,
        invoiceDate: selectedItem.invoiceDate || today,
        invoiceNo: selectedItem?.invoiceNo + "(copied)"
      };


      if (selectedItem.invoiceDetails?.length) {
        setItemFormData(
          selectedItem.invoiceDetails.map(item => ({
            ...item,
            invoiceDetailsId: null,
            invoiceHeaderId: null
          }))
        );
      }

      if (selectedItem.paymentDetails) {
        setPaymentFormData({
          ...selectedItem.paymentDetails,
          paymentDetailsId: null,
          invoiceHeaderId: null
        });
      }
    }
  }, [isCopy, selectedItem]);


  const loadInvoiceDetails = useCallback(async () => {

    console.log(" data for invoice detils items ,,,", headerIdRef.current)

    if (!headerIdRef.current) {
      setItemFormData([]);
      return;
    }
    const data = await get(api + `/invoiceDetails/getAll?rand=${Math.random()}`);

    console.log(" data for invoice detils items ,,,", data)

    if (data && Array.isArray(data)) {
      // setItemFormData(data)

      const filtered = data.filter(
        item => Number(item.invoiceHeaderId) === Number(headerIdRef.current)
      );
      setItemFormData(filtered);

    }
  }, [get])


  const loadPaymentSummary = useCallback(async () => {
    if (!headerIdRef.current) return;

    // const data = await get(api + "/paymentDetails/summary/" + headerId);
    const data = await get(`${api}/paymentDetails/summary/${headerIdRef.current}?t=${Date.now()}`);
    console.log("load for item details ", data)
    if (data) {
      setPaymentFormData(data);
    }
  }, [get]);



  const handleDelete = async (id) => {
    const res = await del(api + "/invoiceDetails/delete/" + id);
    console.log("deleted data..", res)
    if (response.ok) {
      setItemFormData((prev) =>
        prev.filter((item) => item.invoiceDetailsId !== id)
      );
      // await loadInvoiceDetails();
      await loadPaymentSummary();
      AlertHandler("Item deleted", "success");
    } else {
      AlertHandler("Failed to delete item", "danger");
    }
  };


  const showFormHandler = (rowData, action) => () => {
    if (action === "Edit") {
      setEditingItem(rowData);
      // setHeaderFormData(rowData.invoiceHeader);
    }

    if (action === "Delete") {
      handleDelete(rowData.invoiceDetailsId);
    }
  };


  // const saveInvoiceDetails=async()=>{
  //   console.log(" invoice Details...",itemFormData)
  //   const val = {
  //     ...itemFormData,
  //     typeOfInvoiceDetails: "Sales"
  //   }
  //   console.log("value for saved Details", val)
  //   const res = await post(api + "/invoiceDetails/create", val);
  //   console.log("header res", res)
  //   if (response.ok && res?.invoiceHeaderId) {
  //     setItemFormData(res)
  //     AlertHandler("saved to Invoice Details successfully", "success");

  //   } else {
  //     AlertHandler("Failed to save Invoice HeadDetailser", "danger");

  //   }
  // }

  const saveHeader = async () => {
    try {

      const values = headerFormRef.current;


      const val = {
        invoiceHeaderId: values.invoiceHeaderId,
        invoiceNo: values.invoiceNo,
        invoiceTypeName: values.invoiceTypeName,
        invoiceDate: values.invoiceDate,
        customerId: values.customerId,
        supplierId: values.supplierId,
        poNo: values.poNo,
        poDate: values.poDate,
        termOfDelivery: values.termOfDelivery,
        typeOfInvoiceHeader: "SALES",
        statusId: values.statusId
      }
      console.log(" values for save header", val)
      // const res = await post(api + "/invoiceHeader/create", val);
      let res;
      if (headerIdRef.current && !isCopy) {
        res = await put(api + "/invoiceHeader/update/" + headerIdRef.current, val);
        if (!response.ok) {
          AlertHandler(res?.message || "Failed to update Invoice Header", "danger");
          return null;
        }
      }
      else {
        res = await post(api + "/invoiceHeader/create?t=" + Date.now(), val);
        if (!response.ok) {
          AlertHandler(res?.message || "Failed to create Invoice Header", "danger");
          return null;
        }
      }
      console.log(" res for save header ", res)
      if (res) {
        // setHeaderId(res.invoiceHeaderId);
        setHeaderIdSync(res.invoiceHeaderId);
        headerFormRef.current.invoiceHeaderId = res.invoiceHeaderId;
        // AlertHandler(headerId ? "Invoice Header Updated" : "Invoice Header Saved", "success");
        return res.invoiceHeaderId;
      }
    } catch (err) {
      console.log(err);
      AlertHandler("Header error", "danger");
      return null;
    }
  };

  const handleAddItem = async (itemData) => {
    try {

      console.log("itemdata ..", itemData)
      let currentHeaderId = headerIdRef.current;
      if (!currentHeaderId) {

        if (!headerFormRef.current.invoiceTypeName || !headerFormRef.current.customerId) {
          AlertHandler("Please fill Invoice Type and Customer", "danger");
          return;
        }
        const hid = await saveHeader();
        if (!hid) return;
        //  setHeaderId(hid);
        currentHeaderId = hid;

        console.log("invoice header data ..", hid)
      }

      console.log(" detail data ", itemData)
      const val = {
        ...itemData,
        quantity: 1,
        // invoiceHeaderId: currentHeaderId,
        // invoiceHeader: { invoiceHeaderId: currentHeaderId },
        invoiceHeaderId: currentHeaderId,
        invoiceNo: headerFormRef.current.invoiceNo,
        customerId: headerFormRef.current.customerId,
        invoiceDate: headerFormRef.current.invoiceDate,
        typeOfInvoiceDetails: "SALES"
      };

      if (itemData.invoiceDetailsId && !isCopy) {
        const resUpdate = await put(api + "/invoiceDetails/update/" + itemData.invoiceDetailsId, val)
        console.log("update  resuslt", resUpdate)
        if (resUpdate) {
          setItemFormData(prev =>
            prev.map(item =>
              item.invoiceDetailsId === resUpdate.invoiceDetailsId
                ? resUpdate
                : item
            )
          );
          await loadInvoiceDetails();
          await loadPaymentSummary();
          AlertHandler("Item Updated successfully", "success");

        }
        else {
          AlertHandler("Item not  updated ", "danger");
        }
      } else {
        const res = await post(api + "/invoiceDetails/create?t=" + Date.now(), val);
        console.log("  values for saving invoice details...", val)
        console.log(" result for creating invoice details ..", res)
        if (res) {
          setItemFormData(prev => [...prev, res]);

          // await loadPaymentSummary();

          // AlertHandler("Item added successfully", "success");
          // setEditingItem({});
        }
        else {
          AlertHandler("Item not  added ", "danger");
          return
        }
      }
      await loadInvoiceDetails();
      await loadPaymentSummary();
      setEditingItem({});
    } catch (e) {
      console.log(e);
      AlertHandler("Error adding item", "danger");
    }
  };









  const handleSavePayment = async (paymentData) => {
    if (!headerId) {
      AlertHandler("Please add Invoice Header before saving payment", "danger");
      return;
    }
    if (itemFormData.length === 0) {
      AlertHandler("Please add Invoice Items before saving payment", "danger");
      return;
    }

    console.log("paymentdata  ..", paymentData)
    try {
      const updatedHeaderId = await saveHeader();
      await loadPaymentSummary();
      if (updatedHeaderId) {
        const val = {
          ...paymentData,
          ...paymentFormData,
          //  invoiceHeader: { invoiceHeaderId: headerId },
          invoiceNo: headerFormRef.current.invoiceNo,
          customerId: headerFormRef.current.customerId,

          typeofPaymentDetails: "SALES"
        };


        const res = await post(`${api}/paymentDetails/create/${headerId}`, val);
        console.log("..data go for  pyment create  ", val)
        console.log(" res for sdave payemnt", res)
        if (res) {
          AlertHandler("Sales saved successfully", "success");
          onCancel();
        } else {
          AlertHandler("Payment save failed", "danger");
        }
      }
    } catch (err) {
      console.error("Save Error:", err);
      AlertHandler("Something went wrong during save", "danger");
    }
  };
  const actions = ["Edit", "Delete", "Add"];


  // const validate=()=>{

  // }


  function onSubmit(values) {
    console.log("Search/filter values:", values);
  }

  useEffect(() => {
    if (headerId && !initialLoadDone.current) {
      initialLoadDone.current = true;
      loadInvoiceDetails();
      loadPaymentSummary();
    }
  }, [headerId]);

  console.log("item===>", itemFormData)



  const headerWatchFields = [
    "invoiceTypeName",
    "customerId",
    "invoiceDate",
    "poNo",
    "poDate",
    "termOfDelivery"
  ];

  const syncHeaderData = useCallback(async (watchedValues, { setValue }) => {

    if (!watchedValues) return;

    // const customerId = watchedValues[1];
    const [invoiceTypeName, customerId, invoiceDate, poNo, poDate, termOfDelivery] = watchedValues;
    const isCustomerChanged = String(customerId) !== String(headerFormRef.current.customerId);
    if (customerId) {
      const found = AllCustomers.find(
        s => String(s.customerId) === String(customerId)
      );
      if (found) {

        setValue("gstNo", found.gstNo || "");
        setValue("address", found.address || "");
        setValue("state", found.state?.stateName || "");

        headerFormRef.current = {
          ...headerFormRef.current,
          invoiceTypeName,
          customerId,
          invoiceDate,
          poNo,
          poDate,
          termOfDelivery,
          gstNo: found.gstNo || "",
          address: found.address || "",
          state: found.state?.stateName || "",
        };

        const isChanged =
          String(customerId) !== String(headerFormRef.current.customerId) ||
          poDate !== headerFormRef.current.poDate ||
          poNo !== headerFormRef.current.poNo ||
          invoiceDate !== headerFormRef.current.invoiceDate ||
          invoiceTypeName !== headerFormRef.current.invoiceTypeName ||
          termOfDelivery !== headerFormRef.current.termOfDelivery;
        if (headerIdRef.current && isChanged) {
          await saveHeader();
          await loadPaymentSummary();
        }
      }
      // headerFormRef.current = {
      //   ...headerFormRef.current,
      //   invoiceTypeName: watchedValues[0],
      //   customerId: watchedValues[1],
      //   invoiceDate: watchedValues[2],
      //   poNo: watchedValues[3],
      //   poDate: watchedValues[4],
      //   termOfDelivery: watchedValues[5],
      //   gstNo: found.gstNo || "",
      //   address: found.address || "",
      //   state: found.state?.stateName || "",
      // };

    }
  }, [AllCustomers, loadPaymentSummary]);


  useEffect(() => {
    if (!selectedItem?.customerId || !AllCustomers?.length) return;
    const found = AllCustomers.find(
      s => String(s.customerId) === String(selectedItem.customerId)
    );
    if (found) {
      headerFormRef.current = {
        ...headerFormRef.current,
        gstNo: found.gstNo || "",
        address: found.address || "",
        state: found.state?.stateName || "",
      };
    }
  }, [selectedItem?.customerId, AllCustomers]);

  const syncItemData = (watchedValues, { setValue }) => {
    if (!watchedValues) return;

    const serviceTypeId = watchedValues[0];
    const amount = parseFloat(watchedValues[1]) || 0;
    const buyingPrice = parseFloat(watchedValues[2]) || 0;
    if (String(serviceTypeId) === "3") {
      const margin = amount - buyingPrice;
      setValue("marginAmount", margin)
    }
  }
  return (
    <div className={classes.container}>
      <Popupcard
        title={
          isEdit
            ? `Edit Sales Invoice - ${headerFormRef.current.invoiceNo || ""}`
            : "Add Sales Invoice"
        }
        showBack onBack={onCancel}
      >

        <CreateForm
          template={templateForHeader}
          //form1
          rowwise={4}
          // defaultValues={headerFormRef.current}
          defaultValues={{
            ...headerFormRef.current,
            invoiceDate: headerFormRef.current.invoiceDate || today,
            poDate: headerFormRef.current.poDate || "",
            gstNo: headerFormRef.current.gstNo || "",
            address: headerFormRef.current.address || "",
            state: headerFormRef.current.state || "",
          }}
          // onSubmit={saveHeader}
          // onSubmit={async (values) => {
          //   setHeaderFormData(values);
          //   return await saveHeader(values);
          // }}
          // onCancel={onCancel}
          // buttonNamez="Add"
          validate={syncHeaderData}
          watchFields={headerWatchFields}
        // validate={validate}
        // watchFields={["invoiceNo", "invoiceDate", "customerId", "termOfDelivery", "poDate", "poNo"]}
        />


        <CreateForm
          //form2
          template={templateForDetails}
          rowwise={4}
          key={editingItem?.invoiceDetailsId || "new"}

          defaultValues={editingItem}
          watchFields={["serviceTypeId", "amount", "buyingPrice"]}
          onSubmit={handleAddItem}
          onCancel={() => setEditingItem({})}
          buttonName="Add"
          validate={syncItemData}
        />
        <NewTable
          cols={SalesItemTable(showFormHandler, actions, serviceType)}

          data={itemFormData}
          striped
          title=" Sales items"
          // showPlusCircle={false}
          handleAddClick={showFormHandler({}, "Add")}
          // template={templateTable}
          rowwise={4}
          rows={10}
          actions={actions}
          onSubmit={onSubmit}
          // buttonName="Search"
          showFilterIcon={false}
          validate={validate}
        />


        <CreateForm
          //form3
          template={templateForPayment}
          rowwise={4}
          defaultValues={paymentFormData}

          onSubmit={handleSavePayment}
          onCancel={onCancel}
          buttonName="Save"
          validate={validate}
        />

        {/* <Row  >

          <Button type="submit" name={"Save"} className={classes.btn}>
            {"Save"}
          </Button>
        </Row> */}
      </Popupcard>
    </div>
  );
}
export default NewSales;