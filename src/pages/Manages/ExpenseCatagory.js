import React, { useCallback, useEffect, useState } from "react";

import {
  api,
  useFetch,
  alertActions,
  useDispatch,
  useSelector,
  classes,
} from "../../Components/CommonImports/CommonImports";

import NewTable from "../../Components/NewTable/NewTable";
import ExpenseCatagoryTable from "./ExpenseCatagoryTable";

import NewExpenseCat from "./NewExpenseCat";

const ExpenseCatogory = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [expenseCat, setExpenseCat] = useState([]);
  const [Expense, setExpense] = useState([]);
  const [catagoryList, setcatgoryList] = useState([]);
  const [allExpense, setAllExpense] = useState([]);
  const [status, setStatus] = useState([]);

  /* ? Dropdown state moved here */
  const [openRow, setOpenRow] = useState(null);

  /* ? Slider State */
  const [showSlider, setShowSlider] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});

  const [showAlert] = useSelector((state) => [
    state.alertProps.showAlert,
  ]);

  /* ---------------- Alert Handler ---------------- */
  const AlertHandler = (alertContent, alertType) => {
    dispatch(
      alertActions.showAlertHandler({
        showAlert: !showAlert,
        alertMessage: alertContent,
        alertVariant: alertType,
      })
    );
  };

  /* ---------------- Filter Template ---------------- */
  const templatefilter = {
    fields: [
      {
        title: "Exp Category",
        type: "text",
        name: "expenseCatagory",
      },
    ],
  };

  /* ---------------- Form Template ---------------- */
  const template = {
    fields: [
      {
        title: "Seq No",
        type: "text",
        name: "seqNo",
        contains: "text",
        // inppropos: {},
        inpprops: {
          min: 0,
          pattern: {
            value: /^[0-9]*$/,
            message: "Numbers only allowed"
          }
        },
        //  validationProps: "Amount is required",
      },
      {
        title: "Exp Category",
        type: "text",
        contains: "text",
        inppropos: {},
        name: "expenseCatagory",
        validationProps: "Expense category is required",
      },
      {
        title: "Exp Category Desc",
        type: "text",
        contains: "text",
        inppropos: {},
        name: "expCatagoryDesc",
        validationProps: "Expense description is required",

      },
      {
        title: "Status",
        type: "select",
        contains: "text",
        inppropos: {},
        name: "statusId",
        options: status.map((s) => ({
          label: s.statusName,
          value: s.statusId,
        })),
        validationProps: "Status is required",
      },
    ],
  };

  /* ---------------- Load Status ---------------- */
  const loadStatuses = useCallback(async () => {
    const data = await get(api + "/status/getAllByStatusType/EXPENSE");
    console.log(" status for expense ", data)
    if (response.ok) setStatus(data);
  }, [get, response]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  /* ---------------- Load Expense ---------------- */
  const loadExpenses = useCallback(async () => {
    const allExpenses = await get(api + "/expenseCatagory/getall?t=" + Date.now());
    if (response.ok) {
      setExpense(allExpenses);
      setcatgoryList(allExpenses)
      setAllExpense(allExpenses);
    }
  }, [get, response]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  /* ---------------- Save ---------------- */
  const saveExpense = async (val) => {
    const result = await post(api + "/expenseCatagory/create?t=" + Date.now(), val);


    if (val.expenseCatagoryId) {

      if (response.ok) {
        // setExpense((prev) =>
        //   prev.map((x) =>
        //     x.expenseCatagoryId === val.expenseCatagoryId ? result : x
        //   )
        // );
        await loadExpenses()
        AlertHandler("Expense  catagory updated successfully", "success");
      }
      else {
        AlertHandler("Expense catagory update failed", "danger");
      }
    } else {
      if (response.ok) {

        // setExpense((prev) => [...prev, result]);
        await loadExpenses()
        AlertHandler("Expense  catagory created successfully", "success");
      }
      else {
        AlertHandler("Expense  catagory create failed", "danger");

      }
    }

    setShowSlider(false);

  };

  /* ---------------- Delete ---------------- */
  const deleteExpense = async (id) => {
    await del(api + "/expenseCatagory/delete/" + id);

    if (response.ok) {
      setExpense((prev) =>
        prev.filter((c) => c.expenseCatagoryId !== id)
      );
      AlertHandler("Expense deleted successfully", "success");
    } else {
      AlertHandler("Failed to delete Expense", "danger");
    }
  };

  /* ---------------- Search ---------------- */
  const onSubmit = (values) => {
    const searchText = values?.expenseCatagory || "";

    if (!searchText.trim()) {
      setExpense(allExpense);
      return;
    }

    const filtered = allExpense.filter((item) =>
      item.expenseCatagory
        ?.toLowerCase()
        .includes(searchText.toLowerCase())
    );

    setExpense(filtered);
  };

  const validate = () => true;

  /* ---------------- Action Handler ---------------- */
  const showFormHandler = (item, action) => () => {
    setOpenRow(null); // close dropdown

    if (action === "Add") {
      setSelectedItem({});
      setShowSlider(true);
    }

    if (action === "Edit") {
      setSelectedItem({ ...item });
      setShowSlider(true);
    }

    if (action === "Delete") {
      deleteExpense(item.expenseCatagoryId);
    }
  };

  const actions = ["Edit", "Delete", "Add"];
  // ? Save
  const saveExpenseCat = async (val) => {
    const result = await post(api + "/expenseCatagory/create?t=" + Date.now(), val);

    if (response.ok) {
      if (val.expenseCatagoryId) {
        setExpenseCat((prev) =>
          prev.map((x) =>
            x.expenseCatagoryId === val.expenseCatagoryId
              ? result
              : x
          )
        );
        await loadExpenses();
      } else {
        setExpenseCat([...expenseCat, result]);
        await loadExpenses();
      }

      AlertHandler("Saved Successfully", "success");

      // ? Close Slider after Save
      setShowSlider(false);
    }
  };

  return (
    <div className={classes.container}>
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: "650px",
          overflow: "hidden",
        }}
      >
        {/* ---------------- TABLE ---------------- */}
        {!showSlider && (
          <NewTable
            cols={ExpenseCatagoryTable({
              showFormHandler,
              actions,
              openRow,
              setOpenRow,
            })}
            data={Expense}
            striped
            rows={25}
            title="Manage Expense Category"
            showPlusCircle={true}
            handleAddClick={showFormHandler({}, "Add")}
            template={templatefilter}
            validate={validate}
            onSubmit={onSubmit}
            buttonName="Search"
          />
        )}

        {/* ---------------- SLIDER ---------------- */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#fff",
            padding: "20px",
            overflowY: "auto",
            boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
            transform: showSlider
              ? "translateX(0%)"
              : "translateX(100%)",
            transition: "transform 0.4s ease-in-out",
          }}
        >
          {showSlider && (
            <NewExpenseCat
              selectedItem={selectedItem}
              catagoryList={catagoryList}
              saveExpenseCat={saveExpense}
              template={template}
              validate={validate}
              onCancel={() => setShowSlider(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseCatogory;