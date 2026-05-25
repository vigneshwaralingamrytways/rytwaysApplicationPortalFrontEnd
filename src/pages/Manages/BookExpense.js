import React, { useCallback, useEffect, useState } from "react";
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
// import Expense Table from './Expense Table';
// import Upload from "./Upload";
import NewTable from "../../Components/NewTable/NewTable";
import Upload from "./Upload";
// import ExpenseTable from "./ExpenseTable";
import NewExpense from "./NewExpense";
import BookExpenseTable from"./BookExpenseTable";

 const BookExpense = (props) => {

    const { get, del, post, response, loading, error } = useFetch({ data: [] });
    const dispatch = useDispatch();

    const [Expense, setExpense] = useState([]);
    const [defaultValues, setDefaultValues] = useState({});
const [statusList, setStatusList] = useState([]);
    const [showAlert, alertMessage, alertVariant] = useSelector((state) => [
        state.alertProps.showAlert,
        state.alertProps.alertMessage,
        state.alertProps.alertVariant,
    ]);
const [categoryList, setCategoryList] = useState([]);
const [subCategoryList, setSubCategoryList] = useState([]);
const loadCategories = useCallback(async () => {
  const result = await get(api + "/Expense/getCategories");

  if (response.ok) {
    setCategoryList(
      result.map(item => ({
        value: item.id,
        label: item.name
      }))
    );
  } else {
    // AlertHandler("Failed to load categories", "danger");
  }
  

}, [get, response]);

const loadSubCategories = useCallback(async () => {
  const result = await get(api + "/Expense/getSubCategories");

  if (response.ok) {
    setSubCategoryList(
      result.map(item => ({
        value: item.id,
        label: item.name
      }))
    );
  } else {
    // AlertHandler("Failed to load sub categories", "danger");
  }

  

}, [get, response]);

// }, []);


useEffect(() => {
  loadCategories();
  loadSubCategories();
}, [loadCategories, loadSubCategories]);


    const AlertHandler = (alertContent, alertType) => {
        dispatch(
            alertActions.showAlertHandler({
                showAlert: !showAlert,
                alertMessage: alertContent,
                alertVariant: alertType,
            })
        );
    };
const template = {
  fields: [
    {
  
      title: "Expense Date",
      type: "date",
      name: "expenseDate",
      contains: "date",
         inpprops: {  } ,
      validationProps: "Expense date is required",
    },

    {
  
      title: "Expense Category",
      type: "select",
      name: "expenseCategory",
    options: [
        { value: "", label: "Select Category" },
        ...categoryList
      ],  
      validationProps: "Category is required",
    },

    {
  
      title: "Expense Sub Category",
      type: "select",
      name: "expenseSubCategory",
      options: [
        { value: "", label: "Select Sub Category" },
        ...subCategoryList
      ], 
      validationProps: "Sub Category is required",
    },

    {
  
      title: "Expense Amount",
      type: "text",
      name: "expenseAmount",
      contains: "number",
      validationProps: "Amount is required",
    },

    {
  
      title: "Remarks",
      type: "text",
      name: "remarks",
      contains: "text",
    },

    // {
  
    //   title: "Payment Mode",
    //   type: "select",
    //   name: "expenseMode",
    //   options: [
    //     { value: "Bank Transfer", label: "Bank Transfer" },
    //     { value: "Cheque", label: "Cheque" },
    //     { value: "Cash", label: "Cash" },
    //   ],
    //   validationProps: "Payment mode is required",
    // },

    // {
  
    //   title: "Payment Reference",
    //   type: "text",
    //   name: "expenseReference",
    //   contains: "text",
    // },

    // {
  
    //   title: "Account Number",
    //   type: "text",
    //   name: "accountNo",
    //   contains: "number",
    // },

    {
  
      title: "Status",
      type: "select",
      name: "status",
      options: statusList,   
      validationProps: "Status is required",
    },
  ],
};
 

const loadStatuses = useCallback(async () => {
  const data = await get(api + "/Expense/getStatuses");

  if (response.ok) {
    setStatusList(
      data.map((item) => ({
        value: item.id,
        label: item.name
      }))
    );
  } else {
    // AlertHandler("Failed to load status list", "danger");
  }
 

  
// }, [get, response]);
}, []);






useEffect(() => {
  loadStatuses();
}, [loadStatuses]);



   //load Expense from db
    const loadExpenses = useCallback(async () => {
        const allcountries = await get(api + "/Expense/getall");
                const allExpenses = await get(api + "/Expense/getall");

        console.log("all Expense:",allExpenses)
        setExpense(allcountries);
        if (response.ok) {
            setExpense(allExpenses);

        } else {
            console.log("res++>"+response);
            // AlertHandler("failed to get the Expense", "danger")
        }
 





    // }, [get, response])
      }, [])

 useEffect(() => {
loadExpenses();

    }, [loadExpenses]);



    

 const saveExpense = async (val) => {

        if (val.ExpenseId) {
            const updateExpense = await post(api + "/Expense/update/" + val.ExpenseId, val)
              console.log("Update response:", updateExpense);
            if (response.ok) {
                AlertHandler("Expense updated ", "success");
               
                // Expense
                 setExpense((prev) =>
                prev.map((c) => (c.ExpenseId === updateExpense.ExpenseId ? updateExpense : c))
            );
                setDefaultValues({});

                console.log("update resp passed:", response)
            }
            else {
                // AlertHandler("updation failed", "danger");
                console.log("update resp failed:", response)
            }

        }
        else {
            const newExpense = await post(api + "/Expense/create", val);
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
    }


    const rowWiseFields = 3;
    const rowColors = ["#fff"];
    function validate() {

    }



     const deleteExpense = async (ExpenseId) => {
            const deleted = await del(api + "/Expense/deleteone/" + ExpenseId);
    console.log("deleted::"+deleted);
            if (response.ok) {
    
                console.log("resp==>,", response)
    
                AlertHandler("Expense deleted ", "success");
               setExpense((prev) => prev.filter((c) => c.ExpenseId !== ExpenseId));
            } else {
                console.log("resp==>,", response)
                // AlertHandler("Failed to delete Expense", "danger");
            }
        };
    
        // function onSubmit(val) {
    
        //     console.log("resp==>,", response)
        //     saveExpense(val);
        // }

 const searchDetails = async (values) => {
    console.log("values",values)
    // if(values.clicked=="Search"){
    //   const orderapi = "/Expense/searchExpense";
try{
const returnObject = await post(api + "/Expense/searchExpense", values);
    console.log("countrie from filter",returnObject)
        if(returnObject.length>0){
          console.log("returnObject",returnObject)
      setExpense(returnObject);
    }else{
      setExpense([])
    }
}
catch(err){
console.log("err:"+err)
  setExpense([]);
}
  // }col
}

  function onSubmit(values) {
    console.log(values);
    
    searchDetails(values);
  }
  


const actions = ["Edit", "Delete", "Upload"];
   const showFormHandler = (item, action) => () => {
    const isEdit = action === "Edit";
    const formData = isEdit ? { ...item } : {};

    if (action === "Add" || isEdit) {
        dispatch(
            modalActions.showModalHandler({
                selectedData: { ...formData },
                modalWidth: "48%",
                modalLeft: "26%",
                showModal: true,

                selectedForm: (
                    <NewExpense
                        selectedItem={formData}
                        onCancel={() => dispatch(modalActions.hideModalHandler())}
                        saveExpense={saveExpense}
                        template={template}
                        validate={validate}
                        rows={4}
                    />
                ),
            })
        );
    }

    if (action === "Delete") {
        deleteExpense(item.ExpenseId);
    }

if (action === "Upload") {
  dispatch(
    modalActions.showModalHandler({
      selectedData: { ...item },
      modalWidth: "32%",
      modalLeft: "35%",
      showModal: true,
      selectedForm: (
        <Upload
          item={item}
          uploadTitle="Upload Expense Document"
          onCancel={() => dispatch(modalActions.hideModalHandler())}
          saveDetails={() => {}}
        />
      ),
    })
  );
}

};;
 
     return (
          <div className={classes.container}>

             {/* <Popupcard
                title="Add Expense" 

            > */}
 <NewTable
            cols={BookExpenseTable(
              showFormHandler,
              actions
              
            )}
            data={Expense}
            striped
            
            rows={25}
            title="Book Expenses"
            showPlusCircle={true}
            handleAddClick={showFormHandler({},"Add")}
            template={template}           
            rowwise={4}       
            validate={validate}           
            onSubmit={onSubmit}           
            onCancel={props.onCancel}     
            buttonName="Search"
          />


{/* </Popupcard> */}

         </div>
     )
}
export default BookExpense;