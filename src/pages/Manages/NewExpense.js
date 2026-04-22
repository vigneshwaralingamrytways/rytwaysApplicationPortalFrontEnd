import { useEffect, useRef, useState } from "react";
import { api, CreateForm, Popupcard, useFetch, useForm } from "../../Components/CommonImports/CommonImports";
import classes from "../Master/Master.module.css";


export default function NewExpense({
  selectedItem,
  onCancel,
  saveExpense,

  validate, catagoryList, subcatagoryList
}) {

  const { post, get } = useFetch();
  const [allSubData, setAllSubData] = useState([]);
  const [subOptions, setSubOptions] = useState([]);
  const initialFiltered = allSubData
    .filter((s) => String(s.expenseCatagoryId) === String(selectedItem?.expenseCatagoryId))
    .map((s) => ({ value: s.expenseSubCatagoryId, label: s.expenseSubCatagory }));

  const [filteredOptions, setFilteredOptions] = useState(
    selectedItem ? [{ value: "", label: "Select" }, ...initialFiltered] : [{ value: "", label: "Select" }]
  );

  // const [filteredOptions, setFilteredOptions] = useState([{ value: "", label: "Select" }]);
  const prevCatIdRef = useRef(null);
  const [prevCategory, setPrevCategory] = useState(null);
  const loadAllSubCategories = async () => {
    const data = await get(api + "/expenseSubCatagory/getall?t=" + Date.now());
    if (Array.isArray(data)) {
      setAllSubData(data);
    } else {
      setAllSubData([]);
    }
  };

  useEffect(() => {
    loadAllSubCategories();
  }, []);
  const syncSubCategory = (watchValues, { setValue }) => {
    if (!watchValues) return;
    const categoryId = watchValues[0];
    const subCategoryId = watchValues[1];
    if (categoryId) {
      const filtered = allSubData
        .filter((s) => String(s.expenseCatagoryId) === String(categoryId))
        .map((s) => ({ value: s.expenseSubCatagoryId, label: s.expenseSubCatagory }));
      if (categoryId !== prevCatIdRef.current) {
        prevCatIdRef.current = categoryId;
        setFilteredOptions([{ value: "", label: "Select" }, ...filtered]);
        if (selectedItem?.expenseCatagoryId !== categoryId) {
          setValue("expenseSubCatagoryId", "");
        }
      }
    } else {
      setFilteredOptions([{ value: "", label: "Select" }]);
    }
  };
  const template = {
    fields: [
      {
        title: "Expense Date",
        type: "date",
        contains: "date", inpprops: {},
        name: "expenseDate"
      },
      {
        title: "Expense Category",
        type: "select",
        contains: "text", inpprops: {},
        name: "expenseCatagoryId",
        options: [{ value: "", label: "Select" }, ...catagoryList.map((c) => ({ value: c.expenseCatagoryId, label: c.expenseCatagory }))],
      },
      {
        title: "Expense Sub Category",
        type: "select",
        contains: "text", inpprops: {},
        name: "expenseSubCatagoryId",
        options: filteredOptions,
      },
      {
        title: "Expense Amount",
        type: "text",
        contains: "text",
        inpprops: {},
        name: "amount"
      },
      {
        title: "Expense Description",
        type: "text",
        contains: "text",
        inpprops: {},
        name: "expenseDesc"
      },
    ],
  };



  function validate(watchValues, errorMethods) {
    const categoryId = watchValues[0];
    if (categoryId) {
      loadAllSubCategories(categoryId);
    }
    return true;
  }

  const { control, setValue } = useForm({
  defaultValues: selectedItem || {}
});

  useEffect(() => {
    if (allSubData.length > 0 && selectedItem?.expenseCatagoryId) {
      const filtered = allSubData
        .filter((s) => String(s.expenseCatagoryId) === String(selectedItem.expenseCatagoryId))
        .map((s) => ({ value: s.expenseSubCatagoryId, label: s.expenseSubCatagory }));

      setFilteredOptions([{ value: "", label: "Select" }, ...filtered]);
      prevCatIdRef.current = selectedItem.expenseCatagoryId;
      if (selectedItem.expenseSubCatagoryId) {
        setValue("expenseSubCatagoryId", selectedItem.expenseSubCatagoryId);
   
      }
    }
  }, [allSubData, selectedItem,setValue]);

  return (
    <div className={classes.container}>
      <Popupcard
        title="Add Expense"
        showBack onBack={onCancel}


      >
        
          <CreateForm
            template={template}
            rowwise={3}
            defaultValues={selectedItem}
            onSubmit={saveExpense}
            onCancel={onCancel}
            buttonName="Save"
            watchFields={["expenseCatagoryId", "expenseSubCatagoryId"]}
            validate={syncSubCategory}
          />
        


      </Popupcard>
    </div>
  );
}
