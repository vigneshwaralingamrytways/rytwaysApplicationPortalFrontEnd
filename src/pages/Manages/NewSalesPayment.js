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
import NewSalesPaymentTable from "./NewSalesPaymentTable";

export default function NewSalesPayment({
  selectedItem,
  selectedTransaction,
  onCancel,
  template,
  validate,
  isReconcile,
  setSelectedTransactionId,
  selectedId,
  allTransactions, onRowSelect, onPaymentSaved


}) {
  const dispatch = useDispatch();
  const { get, post, put, del, response } = useFetch({ data: [] });
  const [paymentItems, setPaymentItems] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({});
  // const SalesId = selectedItem?.id;
  console.log("selectedItem:", selectedItem);


  const AlertHandler = (msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: true,
        alertMessage: msg,
        alertVariant: type
      })
    );
  };

  // const invoiceHeaderId = selectedItem?.invoiceHeaderId;
  const invoiceHeaderId = selectedItem?.invoiceHeader?.invoiceHeaderId;
  const [formData, setFormData] = useState({});
  const loadPayment = useCallback(async () => {
    if (!invoiceHeaderId) {

      console.log(" SALES id", invoiceHeaderId)

      return;
    }
    // const data = await get(api + `/paymentDetails/getAll`);
    //  const data = await get(api + `/makePayment/getAll/${expenseId}/EXPENSE`);
    const data = await get(api + `/makePayment/getAllByHeader/${invoiceHeaderId}?t=${Date.now()}`);
    console.log("..data for SALES payment load");
    console.log("==================")
    console.table(data)
    if (response.ok && data) {
      setPaymentItems(data);
    }
  }, [get, response, invoiceHeaderId]);

  useEffect(() => {
    loadPayment();
  }, [loadPayment]);
  const loadPaymentSummary = useCallback(async () => {
    if (!invoiceHeaderId) return;
    const data = await get(api + `/paymentDetails/summary/${invoiceHeaderId}?t=${Date.now()}`);
    if (response.ok) {
      // setPaymentFormData(da ta);
      setFormData(prev => ({
        ...prev,
        balanceAmount: data.balanceAmount,
        paidAmount: data.paidAmount,
      }));


    }
  }, [get, response, invoiceHeaderId]);

  useEffect(() => {
    loadPayment();
    loadPaymentSummary();
  }, [loadPayment, loadPaymentSummary]);


  const savePayment = async (paymentData) => {
    console.log("..save payment..", paymentData);
    const val = {
      ...paymentData,
      referenceType: "SALES",
      referenceId: invoiceHeaderId,
      headerId: invoiceHeaderId,
      paymentType: "SALES",
      ...(isReconcile && selectedTransaction && {
        transactionId: selectedTransaction.transactionId,
        paymentDate: selectedTransaction.transactionDate,
      }),
    };
    console.log("payment data for saving", paymentData)
    console.log(" values fro save and update ", val)
    let result;

    // if (isReconsile) {
    //   result = await post(api + "/makePayment/create", val);
    //   console.log("is reconsile  saved payment ", result)
    // }
    if (formData.paymentId) {
      val.paymentId = formData.paymentId;
      console.log("val payment ", val)
      result = await put(api + `/makePayment/update/${formData.paymentId}?t=${Date.now()}`, val);
      console.log("update payment ", result)
    }
    else {
      result = await post(api + `/makePayment/create?t=${Date.now()}`, val);
      console.log("saved payment ", result)
    }
    console.log(" value ..", result);
    // const result = await post(api + "/makePayment/create", val);
    // console.log("..saved res//", result);
    if (response.ok) {
      AlertHandler("SALES Payment saved successfully", "success");
      setFormData({});
      await loadPayment();
      await loadPaymentSummary()
      if (onPaymentSaved) {
        onPaymentSaved();
      }

    } else {
      // AlertHandler("Failed to save payment", "danger");
      const backendError = result?.message || "Failed to save payment";
      AlertHandler(backendError, "danger");
    }
  };

  // useEffect(() => {

  //   if (selectedId && allTransactions.length > 0) {
  //     const matchingTxn = allTransactions.find(
  //       (t) => String(t.transactionId) === String(props.selectedId)
  //     );

  //     if (matchingTxn) {
  //       setSelectedTransactionId(matchingTxn.transactionId);
  //       if (onRowSelect) {
  //         onRowSelect(matchingTxn);
  //       }
  //     }
  //   }

  // }, [selectedId, allTransactions, onRowSelect]);
  const showFormHandler = (rowData, action) => () => {
    if (action === "Edit") {
      // setHeaderFormData(rowData.invoiceHeader);
      // setFormData(rowData);
      setFormData(prev => ({
        ...rowData,
        balanceAmount: prev.balanceAmount,
        paidAmount: prev.paidAmount
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
    const res = await del(api + `/makePayment/delete/${id}?t=${Date.now()}`);
    console.log(res)
    if (response.ok) {
      AlertHandler("Payment Deleted Successfully", "success");
      await loadPayment();
      await loadPaymentSummary();

      if (onPaymentSaved) {
        onPaymentSaved();
      }
    } else {
      AlertHandler("Failed to delete payment", "danger");
    }
  };
  const actions = ["Edit", "Delete", "Add"];
  return (
    <div className={classes.container}>
      <Popupcard title={`Add Payment for Sales InvoiceNo ${selectedItem.invoiceNo || ""}`} showBack onBack={onCancel}>
        <CreateForm
          template={template}
          rowwise={4}
          // defaultValues={{}}
          defaultValues={formData}
          onSubmit={savePayment}
          onCancel={onCancel}
          // buttonName="Save"
          buttonName={formData.paymentId ? "Update" : "Save"}

          validate={validate}
        />
        <NewTable
          cols={NewSalesPaymentTable(showFormHandler, actions)}
          data={paymentItems}
          striped
          hideSNo={true}
          // title="Manage Sales Payment"
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
    </div>
  );
}
