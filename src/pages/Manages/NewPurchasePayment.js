import React, { useEffect, useState, useCallback } from "react";
import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  classes,
  CreateForm,
  Popupcard
} from "../../Components/CommonImports/CommonImports";
import NewTable from "../../Components/NewTable/NewTable";
import NewPurchasePaymentTable from "./NewPurchasePaymentTable";
export default function NewPurchasePayment({
  selectedItem,
  selectedTransaction,
  onCancel,
  template,
  validate,
  isReconcile,
  setSelectedTransactionId,
  onPaymentSaved


}) {
  const dispatch = useDispatch();
  const { get, post, put, del, response } = useFetch({ data: [] });
  const [paymentItems, setPaymentItems] = useState([]);
  console.log("selectedItem:", selectedItem);
  const invoiceHeaderId = selectedItem?.invoiceHeader?.invoiceHeaderId || selectedItem?.invoiceHeaderId;

  const AlertHandler = (msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: true,
        alertMessage: msg,
        alertVariant: type
      })
    );
  };
  const [formData, setFormData] = useState({});
  const loadPayment = useCallback(async () => {
    if (!invoiceHeaderId) {
      console.log(" purchase id", invoiceHeaderId)
      return;
    }
    // const data = await get(api + `/paymentDetails/getAll`);
    //  const data = await get(api + `/makePayment/getAll/${expenseId}/EXPENSE`);
    const data = await get(api + `/makePayment/getAll/${invoiceHeaderId}/PURCHASE?t=${Date.now()}`);
    console.log("..data for purchase payment load", data);
    if (response.ok && data) {
      setPaymentItems(data);
    }
  }, [get, response, invoiceHeaderId]);

  useEffect(() => {
    if (invoiceHeaderId) {
      loadPayment();
    }
  }, [invoiceHeaderId]);

  const [paymentFormData, setPaymentFormData] = useState({});
  const [headerId, setHeaderId] = useState(selectedItem?.invoiceHeaderId || null);
  // const loadPaymentSummary = useCallback(async () => {
  //   if (!invoiceHeaderId) return;

  //   const data = await get(api + "/paymentDetails/byHeader/" + invoiceHeaderId);
  //   if (response.ok && data) {
  //     // setPaymentFormData(da ta);
  //     setFormData(prev => ({
  //       ...prev,
  //       balanceAmount: data.balanceAmount,
  //       paidAmount: data.advance,
  //     }));
  //   }
  // }, [get, response, invoiceHeaderId]);

  // useEffect(() => {
  //   // loadPayment();
  //   loadPaymentSummary();
  // }, [loadPaymentSummary]);

  const savePayment = async (paymentData) => {
    console.log("..save payment..", paymentData);
    const val = {
      ...paymentData,
      referenceId: invoiceHeaderId,
      paymentType: "PURCHASE",
      // ...(isReconcile && selectedTransaction && {
      //   transactionId: selectedTransaction.transactionId,
      //   paymentDate: selectedTransaction.transactionDate,
      // }),
    };
    console.log(" values for save and update ", val)
    let result;
    if (formData.paymentId) {
      val.paymentId = formData.paymentId;
      result = await put(
        api + "/makePayment/update/" + formData.paymentId,
        val
      );
    }
    else {
      result = await post(api + "/makePayment/create", val);
    }
    console.log(" value ..", result);
    // const result = await post(api + "/makePayment/create", val);
    // console.log("..saved res//", result);
    if (response.ok) {
      AlertHandler("Purchase Payment saved successfully", "success");
      setFormData({});

      await loadPayment();
      if (onPaymentSaved) {
        onPaymentSaved();
      }
      // loadPaymentSummary();
    } else {
      // AlertHandler("Failed to save payment", "danger");
      const backendError = result?.message || "Failed to save payment";
      AlertHandler(backendError, "danger");
    }
  };


  const showFormHandler = (rowData, action) => () => {
    if (action === "Edit") {
      // setHeaderFormData(rowData.invoiceHeader);
      // setFormData(rowData);
      setFormData(prev => ({
        ...rowData,
        // balanceAmount: prev.balanceAmount,
        // paidAmount: prev.advance
      }));
      if (rowData.transactionId && setSelectedTransactionId) {
        setSelectedTransactionId(rowData.transactionId);
      }
    }

    if (action === "Delete") {
      deletePayment(rowData.paymentId);
    }
  };


  const deletePayment = async (id) => {
    const res = await del(api + "/makePayment/delete/" + id);
    console.log("res for del..", res)
    if (response.ok) {
      AlertHandler("Payment Deleted Successfully", "success");
      await loadPayment();
      if (onPaymentSaved) {
        onPaymentSaved();
      }
    } else {
      AlertHandler("Failed to delete payment", "danger");
    }
  };
  const actions = ["Edit", "Delete", "Add"];

  return (
    // <div className={classes.container}>
    <Popupcard title={`Add Payment for InvoiveNo: ${selectedItem?.invoiceHeader?.invoiceNo || formData?.invoiceNo || ""}`} showBack onBack={onCancel}>
      <CreateForm
        template={template}
        rowwise={4}
        defaultValues={formData}
        onSubmit={(data) => savePayment(data)}
        onCancel={onCancel}
        buttonName={formData.paymentId ? "Update" : "Save"}
        validate={validate}
      />
      <NewTable
        cols={NewPurchasePaymentTable(showFormHandler, actions)}
        data={paymentItems}
        striped
        // title="Manage Purchase Payment"
        showPlusCircle={false}
        rowwise={4}
        rows={5}
        onSubmit={() => { }}
        // buttonName="Search"
        enableSearch={false}
        showFilterIcon={false}
        validate={validate}
      />
    </Popupcard>
    // </div>
  );
}
