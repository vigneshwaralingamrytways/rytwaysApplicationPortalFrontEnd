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
import ExpenseSubCatagoryTable from "./ExpenseSubCatagoryTable";
import NewExpenseSub from "./NewExpenseSub";

const ExpenseSubCatogory = (props) => {
  const { get, del, post, response } = useFetch({ data: [] });
  const dispatch = useDispatch();

  const [expenseSubs, setExpenseSubs] = useState([]);
  const [allExpenseSubs, setAllExpenseSubs] = useState([]);
  const [expensecatagories, setExpensecatagories] = useState([]);
  const [status, setStatus] = useState([]);

  // ? Slider Control
  const [showSlider, setShowSlider] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  /* ? Dropdown state moved here */
  const [openRow, setOpenRow] = useState(null);

  const [showAlert] = useSelector((state) => [
    state.alertProps.showAlert,
  ]);

  // ? Validate Function
  const validate = () => true;

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

  // ? Load Status
  const loadStatuses = useCallback(async () => {
    const data = await get(api + "/status/getAllByStatusType/EXPENSE?t=" + Date.now());
    if (response.ok) setStatus(data);
  }, [get, response]);

  useEffect(() => {
    loadStatuses();
  }, [loadStatuses]);

  // ? Load Expense Categories
  const loadExpensecatagories = useCallback(async () => {
    const data = await get(api + "/expenseCatagory/getall?t=" + Date.now());
    if (response.ok) {
      setExpensecatagories(
        data.map((x) => ({
          value: x.expenseCatagoryId,
          label: x.expenseCatagory,
        }))
      );
    }
  }, [get, response]);

  useEffect(() => {
    loadExpensecatagories();
  }, [loadExpensecatagories]);

  // ? Template
  const template = {
    fields: [
      {
        title: "Expense Category",
        type: "select",
        contains: "text",

        name: "expenseCatagoryId",
        options: expensecatagories,
        inpprops: {},
      },
      {
        title: "Expense Subcategory",
        type: "text",
        contains: "text",
        name: "expenseSubCatagory",
        inpprops: {},
      },
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
        title: "Description",
        type: "text",
        contains: "text",
        name: "expSubCatagoryDesc",
        inpprops: {},
      },
      {
        title: "Status",
        type: "select",
        name: "statusId",
        contains: "text",
        options: status.map((s) => ({
          label: s.statusName,
          value: s.statusId,
        })),
        inpprops: {},
      },
    ],
  };
  const templatefilter = {
    fields: [
      {
        title: "Exp Category",
        type: "text",
        contains: "text",
        name: "expenseCatagory",
      },
    ],
  };

  // ? Load Sub Categories
  const loadExpenseSubs = useCallback(async () => {
    const data = await get(api + "/expenseSubCatagory/getall?t=" + Date.now());
    if (response.ok) {
      setExpenseSubs(data);
      setAllExpenseSubs(data);
    }
  }, [get, response]);

  useEffect(() => {
    loadExpenseSubs();
  }, [loadExpenseSubs]);

  // ? Save
  const saveExpenseSub = async (val) => {
    const result = await post(api + "/expenseSubCatagory/create?t=" + Date.now(), val);


    if (val.expenseSubCatagoryId) {
      // setExpenseSubs((prev) =>
      //   prev.map((x) =>
      //     x.expenseSubCatagoryId === val.expenseSubCatagoryId
      //       ? result
      //       : x
      //   )
      // );
      if (response.ok) {
        await loadExpenseSubs();
        AlertHandler("updated Successfully", "success");
      }
      else {
        AlertHandler("update failed ", "danger");

      }
    } else {
      // setExpenseSubs([...expenseSubs, result]);
      if (response.ok) {
        await loadExpenseSubs();
        AlertHandler("Saved Successfully", "success");
      } else {
        AlertHandler("Save failed ", "danger");

      }

    }

    // AlertHandler("Saved Successfully", "success");

    // ? Close Slider after Save
    setShowSlider(false);

  };

  // ? Delete
  const deleteExpenseSub = async (id) => {
    await del(api + "/expenseSubCatagory/delete/" + id);

    if (response.ok) {
      setExpenseSubs((prev) =>
        prev.filter((x) => x.expenseSubCatagoryId !== id)
      );
      AlertHandler("deleted Successfully", "success");
    } else {
      AlertHandler("delete failed", "danger");
    }
  };
  const actions = ["Edit", "Delete", "Add"];

  // ? Show Slider Handler
  const showFormHandler = (item, action) => () => {
    setOpenRow(null);
    if (action === "Delete") {
      deleteExpenseSub(item.expenseSubCatagoryId);
      return;
    }

    // ? Open Slider
    setSelectedItem(action === "Edit" ? { ...item } : {});
    setShowSlider(true);
  };

  const onSubmit = (values) => {
    const searchText = values?.expenseSubCatagory || "";

    if (!searchText.trim()) {
      saveExpenseSub(expenseSubs);
      return;
    }

    const filtered = expenseSubs.filter((item) =>
      item.expenseSubCatagory
        ?.toLowerCase()
        .includes(searchText.toLowerCase())
    );

    setExpenseSubs(filtered);
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
        {/* ? TABLE DISAPPEARS */}
        {!showSlider && (
          <NewTable
            cols={ExpenseSubCatagoryTable({
              showFormHandler, actions, openRow,
              setOpenRow,
            })}
            data={expenseSubs}
            striped
            rows={25}
            title="Manage Expense Subcategory"
            showPlusCircle={true}
            handleAddClick={showFormHandler({}, "Add")}
            validate={validate}
            template={templatefilter}
            onSubmit={onSubmit}
            buttonName="Search"
          />
        )}



        {/* ? SLIDER FULL WIDTH */}
        {showSlider && (
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
            <NewExpenseSub
              selectedItem={selectedItem}
              saveExpenseSub={saveExpenseSub}
              template={template}
              validate={validate}
              onCancel={() => setShowSlider(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseSubCatogory;
