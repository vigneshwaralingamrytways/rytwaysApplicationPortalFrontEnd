import React, { useCallback, useEffect, useState } from "react";
import NewExpensePayment from "./NewExpensePayment";

import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";
import NewExpense from "./NewExpense";
import ManageExpenseTable from "./ManageExpenseTable";
import Upload from "./Upload";

import { saveAs } from "file-saver";

const ExpenseManage = (props) => {
  const { isReconsile } = props;

  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [catagoryList, setcatagoryList] = useState([]);
  const [subcatagoryList, setSubcatagoryList] = useState([]);
  const [ManageExpense, setManageExpense] = useState([]);
  const [allManageExpense, setAllManageExpense] = useState([]);

  const [status, setStatus] = useState([]);
  const [paymentModeList, setPaymentModeList] = useState([]);

  const [Payment, setPayment] = useState([]);

  const [showAlert] = useSelector((state) => [
    state.alertProps.showAlert,
  ]);

  // ? Slider State
  const [showSlider, setShowSlider] = useState(false);
  const [sliderContent, setSliderContent] = useState(null);

  // ? Alert Handler
  const AlertHandler = (msg, type) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: msg,
        alertVariant: type,
      })
    );
  };

  // ? Validate Function
  const validate = () => true;

  // ================================
  // LOAD DATA
  // ================================

  const loadStatuses = useCallback(async () => {
    const allstatus = await get(api + `/status/getall?t=${Date.now()}`);
    if (response.ok) setStatus(allstatus);
  }, [get, response]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  const loadExpenses = useCallback(async () => {
    const allExpenses = await get(api + `/expenseCatagory/getall?t=${Date.now()}`);
    if (response.ok) setcatagoryList(allExpenses);
  }, [get, response]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const loadExpenseSubs = useCallback(async () => {
    const data = await get(api + `/expenseSubCatagory/getall?t=${Date.now()}`);
    if (response.ok) setSubcatagoryList(data);
  }, [get, response]);

  useEffect(() => {
    loadExpenseSubs();
  }, [loadExpenseSubs]);

  const loadManageExpenses = useCallback(async () => {
    const allManageExpenses = await get(api + `/manageExpense/getall?t=${Date.now()}`);
    if (response.ok) {
      setManageExpense(allManageExpenses);
      setAllManageExpense(allManageExpenses);
    }
  }, [get, response]);

  useEffect(() => {
    loadManageExpenses();
  }, [loadManageExpenses]);

  // ================================
  // TEMPLATE
  // ================================

  const template = {
    fields: [
      {
        title: "Expense Date",
        type: "date",
        contains:"date",
        value:"expenseDate",
        name: "expenseDate",
          inpprops: {},
      },
      {
        title: "Expense Category",
        type: "select",
        name: "expenseCatagoryId",
        options: catagoryList.map((c) => ({
          value: c.expenseCatagoryId,
          label: c.expenseCatagory,
        })),
      },
      {
        title: "Expense Sub Category",
        type: "select",
        name: "expenseSubCatagoryId",
        options: subcatagoryList.map((s) => ({
          value: s.expenseSubCatagoryId,
          label: s.expenseSubCatagory,
        })),
      },
      {
        title: "Expense Amount",
        type: "text",
        name: "amount",
      },
      {
        title: "Expense Description",
        type: "text",
        name: "expenseDesc",
      },
    ],
  };

  const templateforfilter = {
    fields: [
      { title: "From Date", type: "date", name: "FromDate" },
      { title: "To Date", type: "date", name: "ToDate" },
    ],
  };

  // ================================
  // SAVE / DELETE
  // ================================

  const saveExpense = async (val) => {
    const newExpense = await post(api + "/manageExpense/create?t=" + Date.now(), val);

    if (response.ok) {
      // setManageExpense((prev) => [...prev, newExpense]);
      await loadManageExpenses();
      AlertHandler("Expense Saved Successfully", "success");

      // ? Close Slider after Save
      setShowSlider(false);
    } else {
      AlertHandler("Expense Not Saved", "danger");
    }
  };

  const deleteExpense = async (expenseId) => {
    await del(api + "/manageExpense/delete/" + expenseId);

    if (response.ok) {
      AlertHandler("Expense Deleted", "success");
      setManageExpense((prev) =>
        prev.filter((x) => x.expenseId !== expenseId)
      );
    }
  };

  // ================================
  // SEARCH FILTER
  // ================================

  const onSubmit = (values) => {
    let filteredData = [...allManageExpense];

    if (!values?.FromDate && !values?.ToDate) {
      setManageExpense(allManageExpense);
      return;
    }

    filteredData = filteredData.filter((item) => {
      const itemDate = new Date(item.expenseDate);
      const fromDate = values.FromDate ? new Date(values.FromDate) : null;
      const toDate = values.ToDate ? new Date(values.ToDate) : null;

      return (!fromDate || itemDate >= fromDate) &&
        (!toDate || itemDate <= toDate);
    });

    setManageExpense(filteredData);
  };

  // ================================
  // SLIDER HANDLER
  // ================================

  const showFormHandler = (item, action) => () => {
    if (action === "Delete") {
      deleteExpense(item.expenseId);
      return;
    }

    // ? OPEN SLIDER
    setShowSlider(true);

    if (action === "Add" || action === "Edit") {
      setSliderContent(
        <NewExpense
          selectedItem={action === "Edit" ? item : {}}
          saveExpense={saveExpense}
          catagoryList={catagoryList}
          template={template}
          validate={validate}
          onCancel={() => setShowSlider(false)}
           subcatagoryList={subcatagoryList} 
        />
      );
    }

    if (action === "upload") {
      setSliderContent(
        <Upload
          referenceId={item.expenseId}
          referenceType="EXPENSE"
          uploadTitle="Expense Invoice Upload"
          financialYear={item.expenseDate}
          validate={validate}
          onCancel={() => setShowSlider(false)}
        />
      );
    }

    if (action === "Payment") {
      setSliderContent(
        <NewExpensePayment
          selectedItem={item}
          validate={validate}
          onCancel={() => setShowSlider(false)}
          catagoryList={catagoryList}
        />
      );
    }
  };

  const actions = ["Edit", "Delete", "upload", "Payment"];

  // ================================
  // UI
  // ================================

  return (
    <div className={classes.container}>
      {/* ? TABLE DISAPPEARS */}
      {!showSlider && (
        <NewTable
          cols={ManageExpenseTable({
            showFormHandler,
            actions,
            isReconsile,
          })}
          data={ManageExpense}
          rows={25}
          title="Manage Expenses"
          showPlusCircle={!isReconsile}
          handleAddClick={showFormHandler({}, "Add")}
          template={templateforfilter}
          validate={validate}
          onSubmit={onSubmit}
          buttonName="Search"
        />
      )}

      {/* ? SLIDER FULL WIDTH */}
      {showSlider && (
        <div
          style={{
            width: "100%",
            minHeight: "100vh",
            background: "#fff",
            padding: "25px",
            boxShadow: "0px 0px 20px rgba(0,0,0,0.25)",
          }}
        >
          {sliderContent}
        </div>
      )}
    </div>
  );
};

export default ExpenseManage;
