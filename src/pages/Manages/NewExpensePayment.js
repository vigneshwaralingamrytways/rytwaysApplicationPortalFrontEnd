import React, { useEffect, useState, useCallback } from "react";
import { api, useFetch, alertActions, modalActions, useDispatch, classes } from "../../Components/CommonImports/CommonImports";
import { CreateForm, Popupcard } from "../../Components/CommonImports/CommonImports";
import NewTable from "../../Components/NewTable/NewTable";

import NewExpensePaymentTable from "./NewExpensePaymentTable";

export default function NewExpensePayment({ selectedItem,
  onCancel,
  isReconcile,
  selectedTransaction,
  template,
  validate,

  expenseId,
  setSelectedTransactionId, onPaymentSaved
}) {
  const dispatch = useDispatch();
  const { get, post, del, put, response } = useFetch({ data: [] });
  const [paymentItems, setPaymentItems] = useState([]);

  const AlertHandler = (msg, type) => {
    dispatch(alertActions.showAlertHandler({ showAlert: true, alertMessage: msg, alertVariant: type }));
  };

  const loadPayment = useCallback(async () => {
    // const data = await get(api + "/makePayment/getall");
    if (!expenseId) return;

    const data = await get(api + `/makePayment/getAll/${expenseId}/EXPENSE?t=${Date.now()}`);
    console.log("..data for payment load", data, expenseId)
    if (response.ok)
      setPaymentItems(data);
  }, [get, expenseId, response]);

  useEffect(() => {
    loadPayment();
  }, [loadPayment]);

  const [formData, setFormData] = useState({});

  const showFormHandler = (rowData, action) => () => {
    if (action === "Edit") {
      setFormData(rowData);
      if (rowData.transactionId && setSelectedTransactionId) {
        setSelectedTransactionId(rowData.transactionId);
      }
    }

    if (action === "Delete") {
      deletePayment(rowData.paymentId);
    }
  };
  const savePayment = async (payment) => {

    console.log("..save payment..", payment)
    const val = {

      ...payment,
      referenceId: expenseId,
      paymentType: "EXPENSE",

      ...(isReconcile && selectedTransaction && {
        transactionId: selectedTransaction.transactionId,
        paymentDate: selectedTransaction.transactionDate,
      }),
    }

    console.log(" value ..", val)
    let result;

    if (formData.paymentId) {
      val.paymentId = formData.paymentId;
      result = await put(api + "/makePayment/update/" + formData.paymentId, val);
    } else {
      result = await post(api + "/makePayment/create", val);
    }
    console.log("..saved res//", result)
    if (response.ok) {
      AlertHandler("Payment saved successfully", "success");
      await loadPayment();

      if (onPaymentSaved) {
        onPaymentSaved();
      }
    } else {
      // AlertHandler("Failed to save payment", "danger");
      const errorMsg = result?.message || "Failed to save payment";
      AlertHandler(errorMsg, "danger");
    }
  };
  const deletePayment = async (id) => {
    await del(api + "/makePayment/delete/" + id);

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
  const actions = ["Edit", "Delete"];
  return (
    <div className={classes.container}>
      <Popupcard title={`Add Payment for Expense`} showBack onBack={onCancel}>
        <CreateForm
          template={template}
          rowwise={3}
          // defaultValues={selectedItem}
          defaultValues={formData}
          onSubmit={(data) => savePayment(data)}
          onCancel={onCancel}
          buttonName={formData.paymentId ? "Update" : "Save"}
          validate={validate}
        />
        <NewTable
          cols={NewExpensePaymentTable(showFormHandler, actions)}
          data={paymentItems}
          striped
          // title="Payment Details"
          showPlusCircle={false}
          rowwise={4}
          rows={5}
          onSubmit={() => { }}
          // buttonName="Search"
          showFilterIcon={false}
          enableSearch={false}
          validate={validate}
        />
      </Popupcard>
    </div>
  );
}
