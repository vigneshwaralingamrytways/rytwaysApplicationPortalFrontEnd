import React, { useCallback, useEffect, useState } from "react";
// import NewPayment2 from "./NewPayment2";
import {
  CreateForm,
  SimpleCard,
  Table,
  api,
  useFetch,
  alertActions,
  modalActions,
  useDispatch,
  useSelector,
  classes,
  Popupcard,
} from "../../Components/CommonImports/CommonImports";
// import ExpenseNameMasterTable from "./ExpenseNameMasterTable";
// import ExpenseCatagoryTable from './ExpenseCatagoryTable';

import NewTable from "../../Components/NewTable/NewTable";

// import ExpenseCatagoryTable from "./ExpenseCatagoryTable";
import NewExpense from "./NewExpense";
// import ManageExpenseTable2 from "./ManageExpenseTable2"

import UploadPayment from "./UploadPayment";
// import NewExpense from "./NewExpense";
import NewExpensePayment from "./NewExpensePayment";
import MakePaymentExpenseTable from "./MakePaymentExpenseTable";
import Upload from "./Upload";
import ExpensePaymentReconsile from "./ExpensePaymentReconsile";



const MakePaymentExpense = (props) => {

  const { get, del, post, response, loading, error } = useFetch({ data: [] });
  const dispatch = useDispatch();
  const [categoryList, setCatagoryList] = useState([]);
  const [subCategoryList, setSubcatagoryList] = useState([]);
  const [Expense, setExpense] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]);
  const [defaultValues, setDefaultValues] = useState({});
  const [statusList, setStatusList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  /* ? Slide State */
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null);

  const handlePaymentSaved = () => {
    setRefreshKey(prev => prev + 1);
    loadExpenses();
  };

  const [Payment, setPayment] = useState([]);
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
  const [selectedExpense, setSelectedExpense] = useState(null);



  const [paymentModeList, setPaymentModeList] = useState([]);

  const loadPaymentModes = useCallback(async () => {
    const res = await get(api + "/paymentMode/getall");
    console.log("paymentmode..", res)
    if (response.ok) {
      setPaymentModeList(

        res.map(pm => ({
          value: pm.paymentModeId,
          label: pm.paymentModeName
        }))
      );
    } else {
      setPaymentModeList([]);
    }
  }, [get, response]);
  useEffect(() => {
    loadPaymentModes();
  }, [loadPaymentModes]);


  //load Expense from db
  const loadExpensesCategory = useCallback(async () => {
    // const allcountries = await get(api + "/Expense/getall");

    try {
      const allExpenses = await get(api + "/expenseCatagory/getall");

      console.log("all ExpenseCat:", allExpenses)
      // setExpense(allcountries);
      if (response.ok) {
        setCatagoryList(allExpenses.map(cl => ({
          value: cl.expenseCatagoryId,
          label: cl.expenseCatagory
        })));

      } else {
        console.log("res++>" + response);
        // AlertHandler("failed to get the Expense", "danger")
      }
    }
    catch (err) {
      console.log("err", err)
    }

  }, [get, response])

  useEffect(() => {
    loadExpensesCategory();

  }, [loadExpensesCategory]);


  //expsubcat


  const loadExpenseSubs = useCallback(async () => {
    try {
      const data = await get(api + "/expenseSubCatagory/getall");
      console.log("data for loadexp sub:", data)
      if (response.ok) {
        setSubcatagoryList(data.map(scl => ({
          value: scl.expenseSubCatagoryId,
          label: scl.expenseSubCatagory
        })));
      }
    } catch (err) {
      console.error(err);
      // AlertHandler("Failed to load Expense Subcatagories", "danger");
    }
  }, [get, response]);

  useEffect(() => {
    loadExpenseSubs();
  }, [loadExpenseSubs]);



  const loadpayment = useCallback(async (expenseId) => {
    // const data = await get(api + "/makePayment/byExpense/getall/" + expenseId);
    const data = await get(api + `/makePayment/getAll/${expenseId}/EXPENSE?t=${Date.now()}`);
    // if (response.ok) setPayment(data.map(s => ({ value: s.id, label: s.supplierName })));


    console.log("resul load pay..", data)
    if (response.ok && Array.isArray(data)) {
      setPayment(data);
    } else {
      setPayment([]);
    }
  }, [get, response]);

  // useEffect(() => {
  //   loadpayment();
  // }, [loadpayment]);


  const templateforfilter = {
    fields: [
      // {
      //   legend: "Expense Details",
      //   title: "Expense Name",
      //   type: "text",
      //   name: "ExpenseName",
      //   contains: "text",
      //   validationProps: "Expense name is required",
      // },
      // {
      //   legend: "Expense Details",
      //   title: "Expense Seq no",
      //   type: "text",
      //   name: "ExpensSeqNo",
      // },

      {

        title: "From Date",
        type: "date",
        name: "fromDate",
      },
      {

        title: "To Date",
        type: "date",
        name: "toDate",
      },
      {

        title: "Expense Category",
        type: "select",
        name: "categoryId",
        options: categoryList,
      },
      {

        title: "Expense Sub Category",
        type: "select",
        name: "subCategoryId",
        options: subCategoryList,
      },
    ]
  };



  const loadExpenses = useCallback(async () => {
    // const allcountries = await get(api + "/Expense/getall");
    const allExpenses = await get(api + `/manageExpense/getall?t=${Date.now()}`);
    console.log("all Expense:", allExpenses)
    // setExpense(allcountries);
    if (response.ok) {
      setExpense(allExpenses);
      setAllExpenses(allExpenses);

    } else {
      console.log("res++>" + response);
      // AlertHandler("failed to get the Expense", "danger")
    }


  }, [get, response])


  useEffect(() => {
    loadExpenses();

  }, [loadExpenses, refreshKey]);

  const saveExpense = async (val) => {


    const newExpense = await post(api + "/manageExpense/create", val);
    console.log("Expense resp :", newExpense)

    if (response.ok) {
      AlertHandler("Expense saved ", "success");
      setExpense([...Expense, newExpense])
      setDefaultValues({});
      console.log("resp==>:", response);
    }
    else {
      console.log("resp==>:", response);
      // AlertHandler("Expense not saved", "danger")
    }

  }


  const rowWiseFields = 3;
  function validate() {

  }



  const deleteExpense = async (expenseId) => {
    const deleted = await del(api + "/manageExpense/delete/" + expenseId);
    console.log("deleted::" + deleted);
    if (response.ok) {

      console.log("resp==>,", response)

      AlertHandler("Expense deleted ", "success");
      setExpense((prev) => prev.filter((c) => c.expenseId !== expenseId));
    } else {
      console.log("resp==>,", response)
      // AlertHandler("Failed to delete Expense", "danger");
    }
  };

  // function onSubmit(val) {

  //     console.log("resp==>,", response)
  //     saveExpense(val);
  // }



  function onSubmit(values) {
    console.log(values);


  }


  const templatePayement = {
    fields: [


      {
        title: "Payment Date",
        name: "paymentDate",
        type: "date",
        contains: "date",
        options: [],
        inpprops: { md: 3, },

      },

      {
        title: "Payment Mode",

        name: "paymentModeId",
        type: "select",
        inpprops: { md: 12, rows: 4 },
        options: paymentModeList,
        validationProps: "Item description is required"
      },
      {
        options: [],
        title: "Amount",
        name: "amount",
        type: "number",
        inpprops: { md: 12, rows: 4 },
        validationProps: "Item description is required"
      },
      {
        options: [],
        title: "TDS",
        name: "tds",
        type: "number",
        inpprops: { md: 12, rows: 4 },
        validationProps: "Item description is required"
      },

      // {
      //   options: [],
      //   title: "Balance Amount",
      //   name: "balanceAmount",
      //   type: "number",
      //   inpprops: { md: 12, rows: 4 },
      //   validationProps: "Item description is required"
      // },
      // {
      //   options: [],
      //   title: "Paid Amount",
      //   name: "paidAmount",
      //   type: "number",
      //   inpprops: { md: 12, rows: 4 },
      //   validationProps: "Paid Amount is required"
      // },
      //  { options: [],
      //     title: "Reference",
      //     name: "itemDesc",
      //     type: "number",
      //     inpprops: { md: 12, rows: 4 },
      //     validationProps: "Item description is required"
      // },
      //  { options: [],
      //     title: "Bank name",
      //     name: "itemDesc",
      //     type: "select",
      //     inpprops: { md: 12, rows: 4 },
      //     validationProps: "Item description is required"
      // },

      {
        options: [],
        title: "remark",//remarker
        name: "remark",
        type: "number",
        inpprops: { md: 12, rows: 4 },
        validationProps: "Item description is required"
      },

    ]
  }


  const savepayment = async (payment, expenseId) => {
    console.log("Sending payment:", payment, expenseId);
    const val = {
      ...payment,
      // paidAmount: payment.paid,
      // balanceAmount: payment.balance,
      // remark: payment.remark,
      referenceId: expenseId,
      paymentType: "EXPENSE"
    };
    if (!expenseId) {
      AlertHandler("Expense not selected", "danger");
      return;
    }
    const result = await post(api + "/makePayment/create", val);

    console.log("res for payment..", result)
    if (response.ok) {
      AlertHandler("Payment saved successfully", "success");
      loadpayment(expenseId);
    } else {
      AlertHandler("Failed to save payment", "danger");
    }
  };


  // }
  const searchDetails = (values) => {
    console.log("Filter values:", values);

    let filteredData = [...allExpenses];

    if (!values?.fromDate && !values?.toDate && !values?.categoryId && !values?.subCategoryId) {
      setExpense(allExpenses);
      return;
    }

    filteredData = filteredData.filter(item => {
      const itemDate = new Date(item.expenseDate).setHours(0, 0, 0, 0);
      const fromDate = values.fromDate ? new Date(values.fromDate).setHours(0, 0, 0, 0) : null;
      const toDate = values.toDate ? new Date(values.toDate).setHours(0, 0, 0, 0) : null;
      const catId = values.categoryId ? Number(values.categoryId) : null;
      const subCatId = values.subCategoryId ? Number(values.subCategoryId) : null;

      return (!fromDate || itemDate >= fromDate)
        && (!toDate || itemDate <= toDate)
        && (!catId || item.expenseCatagoryId === catId)
        && (!subCatId || item.expenseSubCatagoryId === subCatId);
    });

    setExpense(filteredData);
  };

  function onSubmit(values) {
    searchDetails(values);
  }



  const showFormHandler = (item, action) => () => {

    const closeSlide = () => {
      setIsSlideOpen(false);
      setActiveForm(null);
      loadExpenses()
    };
    // if (action === "Add" || isEdit) {
    //   dispatch(
    //     modalActions.showModalHandler({
    //       selectedData: { ...formData },
    //       modalWidth: "48%",
    //       modalLeft: "26%",
    //       showModal: true,

    //       selectedForm: (
    //         <NewExpense
    //           selectedItem={formData}
    //           onCancel={() => dispatch(modalActions.hideModalHandler())}
    //           saveExpense={saveExpense}
    //           template={template}
    //           validate={validate}
    //           // rowWise={4
    //           rowWiseFields={4}

    //         />
    //       ),
    //     })
    //   );
    // }

    if (action === "Delete") {
      deleteExpense(item.expenseId);
    }

    if (action === "Payment") {
      setActiveForm(
        <ExpensePaymentReconsile
          //  selectedItem={item}
          item={item}
          savepayment={savepayment}
          templatePayement={templatePayement}
          onPaymentSaved={handlePaymentSaved}
          validate={validate}
          onClose={closeSlide}
        />
      )
      setIsSlideOpen(true);
    }
  };




  const actions = ["Edit", "Delete", "upload", "Payment"];

  return (
    <div className={classes.container} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div style={{
        transition: "0.4s ease",
        opacity: isSlideOpen ? 0 : 1,
        pointerEvents: isSlideOpen ? "none" : "auto",
      }}>

        <NewTable


          cols={MakePaymentExpenseTable({
            showFormHandler,
            actions
          }

          )}
          data={Expense}
          striped

          rows={25}
          title="Make Expense Payments"
          // showPlusCircle={true}
          handleAddClick={showFormHandler({}, "Add")}
          template={templateforfilter}
          rowwise={rowWiseFields}
          validate={validate}
          onSubmit={onSubmit}
          onCancel={props.onCancel}
          buttonName="Search"
          rowWise={4}
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
          transform: isSlideOpen
            ? "translateX(0%)"
            : "translateX(100%)",
          transition: "0.4s ease-in-out",
          zIndex: 999,
          overflowY: "auto",
        }}
      >
        {activeForm}
      </div>
    </div>

  )
}
export default MakePaymentExpense;